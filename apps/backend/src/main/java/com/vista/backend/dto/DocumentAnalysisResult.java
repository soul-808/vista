package com.vista.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentAnalysisResult {
    private boolean success;
    private String error;
    private String riskScore;
    private String complianceType;
    private String jurisdiction;
    private List<String> tags;
    private List<String> flaggedClauses;
    private String summary;
} 