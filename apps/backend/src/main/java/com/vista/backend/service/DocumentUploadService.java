package com.vista.backend.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vista.backend.dto.ComplianceDocumentDTO;
import com.vista.backend.dto.DocumentAnalysisResult;
import com.vista.backend.dto.UserDto;
import com.vista.backend.entity.ComplianceDocument;
import com.vista.backend.entity.User;
import com.vista.backend.repository.ComplianceDocumentRepository;
import com.vista.backend.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DocumentUploadService {

    private final ComplianceDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final ComplianceAnalysisService complianceAnalysisService;
    private final DocumentEmbeddingService documentEmbeddingService;
    private static final int MAX_FILENAME_LENGTH = 490; // Allowing some space for ellipsis

    @Autowired
    public DocumentUploadService(
            ComplianceDocumentRepository documentRepository,
            UserRepository userRepository,
            ComplianceAnalysisService complianceAnalysisService,
            DocumentEmbeddingService documentEmbeddingService) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.complianceAnalysisService = complianceAnalysisService;
        this.documentEmbeddingService = documentEmbeddingService;
    }

    public ComplianceDocumentDTO uploadDocument(MultipartFile file, String userSelectedDocType) throws IOException {
        // Get currently authenticated user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));

        // Process file
        byte[] fileContent = file.getBytes();
        String filename = file.getOriginalFilename();
        
        // Truncate filename if too long
        if (filename != null && filename.length() > MAX_FILENAME_LENGTH) {
            filename = filename.substring(0, MAX_FILENAME_LENGTH - 3) + "...";
        }

        // Analyze document with AI
        DocumentAnalysisResult analysis = complianceAnalysisService.analyzeDocument(fileContent, filename);
        
        // Determine compliance type - prefer AI analysis if available
        String complianceType = analysis.getComplianceType();
        if (complianceType == null || complianceType.trim().isEmpty()) {
            complianceType = userSelectedDocType; // Fall back to user selection if AI didn't provide a type
        }
        
        log.info("Document analysis complete - AI risk score: {}, User selected type: {}, AI determined type: {}", 
                analysis.getRiskScore(), userSelectedDocType, complianceType);

        // Create and save the document entity
        ComplianceDocument document = ComplianceDocument.builder()
                .filename(filename)
                .uploadedBy(user)
                .riskScore(analysis.getRiskScore())
                .complianceType(complianceType)
                .sourceSystem("User Upload")
                .jurisdiction(analysis.getJurisdiction())
                .tags(analysis.getTags() != null ? analysis.getTags() : new ArrayList<>())
                .flaggedClauses(analysis.getFlaggedClauses() != null ? analysis.getFlaggedClauses() : new ArrayList<>())
                .originalDoc(fileContent)
                .notes(analysis.getSummary())
                .createdAt(LocalDateTime.now())
                .build();

        ComplianceDocument savedDocument = documentRepository.save(document);
        
        // Extract text content from document for embedding
        try {
            String textContent = extractTextFromDocument(fileContent, filename);
            
            // Prepare metadata for Pinecone storage
            Map<String, String> metadata = new HashMap<>();
            metadata.put("documentId", savedDocument.getId().toString());
            metadata.put("filename", filename);
            metadata.put("riskScore", analysis.getRiskScore());
            metadata.put("complianceType", complianceType);
            metadata.put("sourceSystem", "User Upload");
            
            if (analysis.getJurisdiction() != null) {
                metadata.put("jurisdiction", analysis.getJurisdiction());
            }
            
            if (analysis.getSummary() != null) {
                metadata.put("summary", analysis.getSummary());
            }
            
            if (analysis.getTags() != null && !analysis.getTags().isEmpty()) {
                metadata.put("tags", String.join(",", analysis.getTags()));
            }
            
            // Store document in Pinecone via DocumentEmbeddingService
            int segmentsCount = documentEmbeddingService.processDocument(textContent, savedDocument.getId().toString(), metadata);
            log.info("Document embedded in Pinecone with {} segments for RAG", segmentsCount);
        } catch (Exception e) {
            // Log error but don't fail the upload if Pinecone storage fails
            log.error("Failed to store document in Pinecone for RAG capabilities", e);
        }
        
        // Convert to DTO for response
        return convertToDTO(savedDocument);
    }
    
    /**
     * Extracts text content from document binary data.
     * This is a simplified version - in production, use document type-specific parsers.
     */
    private String extractTextFromDocument(byte[] content, String filename) {
        // For simplicity, convert binary content to string
        // In production, use Apache Tika or similar library for proper content extraction
        return new String(content);
    }
    
    private ComplianceDocumentDTO convertToDTO(ComplianceDocument document) {
        User user = document.getUploadedBy();
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole());
        
        return ComplianceDocumentDTO.builder()
                .id(document.getId())
                .filename(document.getFilename())
                .uploadedBy(userDto)
                .riskScore(document.getRiskScore())
                .complianceType(document.getComplianceType())
                .sourceSystem(document.getSourceSystem())
                .jurisdiction(document.getJurisdiction())
                .tags(document.getTags())
                .flaggedClauses(document.getFlaggedClauses())
                .notes(document.getNotes())
                .createdAt(document.getCreatedAt())
                .build();
    }
} 