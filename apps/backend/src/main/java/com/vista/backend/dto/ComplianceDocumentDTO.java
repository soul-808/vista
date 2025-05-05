package com.vista.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceDocumentDTO {
    private UUID id;
    private String filename;
    private UserDto uploadedBy;
    private String riskScore;
    private String complianceType;
    private String sourceSystem;
    private String jurisdiction;
    private List<String> tags;
    private List<String> flaggedClauses;
    private String notes;
    private LocalDateTime createdAt;
    
    // We don't include the binary document data in the DTO by default
    // to avoid heavy data transfer. The actual documents would be 
    // fetched separately when needed.
} 