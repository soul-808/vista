package com.vista.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vista.backend.dto.ComplianceDocumentDTO;
import com.vista.backend.dto.UserDto;
import com.vista.backend.entity.ComplianceDocument;
import com.vista.backend.entity.ComplianceType;
import com.vista.backend.entity.User;
import com.vista.backend.repository.ComplianceDocumentRepository;
import com.vista.backend.repository.UserRepository;

@Service
@Transactional
public class ComplianceDocumentService {

    private final ComplianceDocumentRepository complianceDocumentRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Autowired
    public ComplianceDocumentService(ComplianceDocumentRepository complianceDocumentRepository, 
                                     UserRepository userRepository,
                                     UserService userService) {
        this.complianceDocumentRepository = complianceDocumentRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public List<ComplianceDocumentDTO> getAllDocuments() {
        return complianceDocumentRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ComplianceDocumentDTO> getDocumentById(UUID id) {
        return complianceDocumentRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<ComplianceDocumentDTO> getDocumentsByRiskScore(String riskScore) {
        return complianceDocumentRepository.findByRiskScoreOrderByCreatedAtDesc(riskScore).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ComplianceDocumentDTO> getDocumentsByComplianceType(String complianceType) {
        // We can still validate against the enum if needed
        if (complianceType != null) {
            // Optional validation: check if it's a valid compliance type
            ComplianceType.fromDisplayName(complianceType); // This will return OTHER if not valid
        }
        
        return complianceDocumentRepository.findByComplianceTypeOrderByCreatedAtDesc(complianceType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ComplianceDocumentDTO> searchDocuments(String searchTerm) {
        return complianceDocumentRepository.search(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ComplianceDocumentDTO> getDocumentsByTag(String tag) {
        return complianceDocumentRepository.findByTag(tag).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ComplianceDocumentDTO saveDocument(ComplianceDocumentDTO documentDTO) {
        ComplianceDocument document = convertToEntity(documentDTO);
        ComplianceDocument savedDocument = complianceDocumentRepository.save(document);
        return convertToDTO(savedDocument);
    }

    public void deleteDocument(UUID id) {
        complianceDocumentRepository.deleteById(id);
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

    private ComplianceDocument convertToEntity(ComplianceDocumentDTO dto) {
        User user = null;
        if (dto.getUploadedBy() != null && dto.getUploadedBy().getId() != null) {
            user = userRepository.findById(dto.getUploadedBy().getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
        }
        
        return ComplianceDocument.builder()
                .id(dto.getId())
                .filename(dto.getFilename())
                .uploadedBy(user)
                .riskScore(dto.getRiskScore())
                .complianceType(dto.getComplianceType())
                .sourceSystem(dto.getSourceSystem())
                .jurisdiction(dto.getJurisdiction())
                .tags(dto.getTags())
                .flaggedClauses(dto.getFlaggedClauses())
                .notes(dto.getNotes())
                .createdAt(dto.getCreatedAt())
                .build();
    }
} 