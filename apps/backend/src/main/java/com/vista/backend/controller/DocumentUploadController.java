package com.vista.backend.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.vista.backend.dto.ComplianceDocumentDTO;
import com.vista.backend.dto.ErrorResponse;
import com.vista.backend.service.DocumentUploadService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/document-upload")
@Slf4j
public class DocumentUploadController {

    private final DocumentUploadService documentUploadService;

    @Autowired
    public DocumentUploadController(DocumentUploadService documentUploadService) {
        this.documentUploadService = documentUploadService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAndAnalyzeDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "docType", required = false, defaultValue = "Unknown") String docType) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("File cannot be empty"));
        }

        try {
            log.info("Received document upload request for file: {}, type: {}", file.getOriginalFilename(), docType);
            ComplianceDocumentDTO result = documentUploadService.uploadDocument(file, docType);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            log.error("Error processing document upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error processing document: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during document upload", e);
            String errorMessage = "Document upload failed. ";
            
            if (e.getMessage() != null && e.getMessage().contains("value too long for type")) {
                errorMessage += "The document content exceeds the maximum allowable size for storage. Please try uploading a smaller document or contact support.";
            } else {
                errorMessage += "An unexpected error occurred: " + e.getMessage();
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(errorMessage));
        }
    }
} 