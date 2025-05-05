package com.vista.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vista.backend.dto.ComplianceDocumentDTO;
import com.vista.backend.service.ComplianceDocumentService;

@RestController
@RequestMapping("/compliance-documents")
public class ComplianceDocumentController {

    private final ComplianceDocumentService complianceDocumentService;

    @Autowired
    public ComplianceDocumentController(ComplianceDocumentService complianceDocumentService) {
        this.complianceDocumentService = complianceDocumentService;
    }

    @GetMapping
    public ResponseEntity<List<ComplianceDocumentDTO>> getAllDocuments(
            @RequestParam(required = false) String riskScore,
            @RequestParam(required = false) String complianceType,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search) {
        
        List<ComplianceDocumentDTO> documents;
        
        if (riskScore != null) {
            documents = complianceDocumentService.getDocumentsByRiskScore(riskScore);
        } else if (complianceType != null) {
            documents = complianceDocumentService.getDocumentsByComplianceType(complianceType);
        } else if (tag != null) {
            documents = complianceDocumentService.getDocumentsByTag(tag);
        } else if (search != null) {
            documents = complianceDocumentService.searchDocuments(search);
        } else {
            documents = complianceDocumentService.getAllDocuments();
        }
        
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplianceDocumentDTO> getDocumentById(@PathVariable UUID id) {
        return complianceDocumentService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ComplianceDocumentDTO> createDocument(@RequestBody ComplianceDocumentDTO documentDTO) {
        ComplianceDocumentDTO createdDocument = complianceDocumentService.saveDocument(documentDTO);
        return new ResponseEntity<>(createdDocument, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComplianceDocumentDTO> updateDocument(
            @PathVariable UUID id, 
            @RequestBody ComplianceDocumentDTO documentDTO) {
        
        if (!complianceDocumentService.getDocumentById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        documentDTO.setId(id);
        ComplianceDocumentDTO updatedDocument = complianceDocumentService.saveDocument(documentDTO);
        return ResponseEntity.ok(updatedDocument);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        if (!complianceDocumentService.getDocumentById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        complianceDocumentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
} 