package com.vista.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for document analysis results from the AI service
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentAnalysisResult {
    private boolean success;
    private String error;
    private String riskScore;
    
    /**
     * The compliance type as a string. This is the display name that will be
     * converted to a ComplianceType enum value using ComplianceType.fromDisplayName()
     */
    private String complianceType;
    
    private String jurisdiction;
    private List<String> tags;
    private List<String> flaggedClauses;
    private String summary;
} 