package com.vista.backend.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vista.backend.dto.DocumentAnalysisResult;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ComplianceAnalysisService {

    private final OpenAIService openAIService;
    private final ObjectMapper objectMapper;
    private static final int MAX_SUMMARY_LENGTH = 5000;
    private static final int MAX_RISK_SCORE_LENGTH = 50;
    private static final int MAX_COMPLIANCE_TYPE_LENGTH = 100;
    private static final int MAX_JURISDICTION_LENGTH = 100;
    private static final int MAX_CLAUSE_LENGTH = 500;
    private static final int MAX_TAG_LENGTH = 100;
    
    // Valid risk scores
    private static final List<String> VALID_RISK_SCORES = Arrays.asList("LOW", "MEDIUM", "HIGH");
    
    // Common compliance document types
    private static final List<String> COMMON_COMPLIANCE_TYPES = Arrays.asList(
            "KYC", "AML", "Sanctions", "Regulatory", "Policy", 
            "Risk Assessment", "Audit Report", "Training", "Data Privacy", 
            "Compliance Review", "GDPR", "SEC Filing", "Financial Statement");

    @Autowired
    public ComplianceAnalysisService(OpenAIService openAIService, ObjectMapper objectMapper) {
        this.openAIService = openAIService;
        this.objectMapper = objectMapper;
    }

    /**
     * Analyzes a document using AI to extract compliance-related information.
     * 
     * @param documentContent The binary content of the document
     * @param filename The name of the document file
     * @return Analysis results containing extracted compliance information
     */
    public DocumentAnalysisResult analyzeDocument(byte[] documentContent, String filename) {
        try {
            // Convert document content to text
            String textContent = extractTextFromDocument(documentContent, filename);
            
            // Prepare the prompt for OpenAI
            String prompt = buildCompliancePrompt(textContent, filename);
            
            // Call OpenAI API
            String response = openAIService.callOpenAI(prompt);
            
            // Extract content from response
            String content = openAIService.extractContentFromResponse(response);
            
            // Parse the JSON from the content
            JsonNode contentJson = openAIService.extractJsonFromContent(content);
            
            if (contentJson != null) {
                String summary = contentJson.has("summary") ? contentJson.get("summary").asText() : "";
                // Truncate long summaries to prevent DB issues
                summary = truncateIfNeeded(summary, MAX_SUMMARY_LENGTH);
                
                // Extract and normalize risk score
                String riskScore = "MEDIUM"; // Default
                if (contentJson.has("riskScore")) {
                    String rawRiskScore = contentJson.get("riskScore").asText().toUpperCase().trim();
                    riskScore = normalizeRiskScore(rawRiskScore);
                }
                
                // Extract and normalize compliance type
                String complianceType = "";
                if (contentJson.has("complianceType")) {
                    complianceType = normalizeComplianceType(
                        truncateIfNeeded(contentJson.get("complianceType").asText(), MAX_COMPLIANCE_TYPE_LENGTH)
                    );
                }
                
                String jurisdiction = contentJson.has("jurisdiction") 
                    ? truncateIfNeeded(contentJson.get("jurisdiction").asText(), MAX_JURISDICTION_LENGTH)
                    : "";
                
                return DocumentAnalysisResult.builder()
                    .success(true)
                    .riskScore(riskScore)
                    .complianceType(complianceType)
                    .jurisdiction(jurisdiction)
                    .tags(parseJsonArray(contentJson, "tags"))
                    .flaggedClauses(parseJsonArray(contentJson, "flaggedClauses"))
                    .summary(summary)
                    .build();
            } else {
                // Fallback: try to extract key information with simple string matching
                return extractWithFallback(content);
            }
        } catch (Exception e) {
            log.error("Error analyzing document with AI", e);
            return DocumentAnalysisResult.builder()
                    .success(false)
                    .error("Failed to analyze document: " + e.getMessage())
                    .riskScore("MEDIUM") // Default if analysis fails
                    .build();
        }
    }

    /**
     * Normalizes risk score to one of our standard values: LOW, MEDIUM, HIGH
     */
    private String normalizeRiskScore(String rawRiskScore) {
        // Direct match
        if (VALID_RISK_SCORES.contains(rawRiskScore)) {
            return rawRiskScore;
        }
        
        // Check for variations
        if (rawRiskScore.contains("LOW") || rawRiskScore.contains("MINIMAL") || 
            rawRiskScore.contains("MINOR") || rawRiskScore.contains("SLIGHT")) {
            return "LOW";
        } else if (rawRiskScore.contains("HIGH") || rawRiskScore.contains("SEVERE") || 
                   rawRiskScore.contains("CRITICAL") || rawRiskScore.contains("EXTREME")) {
            return "HIGH";
        } else {
            // Default to MEDIUM for anything else
            return "MEDIUM";
        }
    }
    
    /**
     * Normalizes compliance type to a standard format
     */
    private String normalizeComplianceType(String rawType) {
        if (rawType == null || rawType.trim().isEmpty()) {
            return "";
        }
        
        // Check for exact matches with our common types first
        for (String commonType : COMMON_COMPLIANCE_TYPES) {
            if (rawType.toUpperCase().contains(commonType.toUpperCase())) {
                return commonType;
            }
        }
        
        // If no match, return the cleaned raw type
        return rawType.trim();
    }

    private String extractTextFromDocument(byte[] content, String filename) {
        // This is a simplified version - in a real implementation, 
        // you would use libraries like Apache PDFBox for PDFs, POI for Office docs, etc.
        
        // For now, just return a portion of the binary data as text
        // In reality, you'd use the appropriate parser based on file extension
        if (content.length > 1000) {
            return new String(content, 0, 1000);  // Just first 1000 bytes as demo
        }
        return new String(content);
    }

    private String buildCompliancePrompt(String documentContent, String filename) {
        return "You are an expert compliance analyst. Please analyze the following document titled '" + 
               filename + "' and extract key compliance information.\n\n" +
               "Document content:\n" + documentContent + "\n\n" +
               "Please provide the following information in JSON format:\n" +
               "1. riskScore: Assess the document's risk level - MUST be one of: LOW, MEDIUM, or HIGH\n" +
               "2. complianceType: Identify the specific compliance category this document belongs to. " +
               "Common types include: KYC, AML, Sanctions, Regulatory, Policy, Risk Assessment, " +
               "Audit Report, Training, Data Privacy, etc. Be specific.\n" +
               "3. jurisdiction: What geographical jurisdiction does this document apply to?\n" +
               "4. tags: List up to 5 relevant tags for categorizing this document\n" +
               "5. flaggedClauses: List any concerning clauses that require attention\n" +
               "6. summary: A brief summary of the document content\n\n" +
               "It's critical that you provide a proper assessment of the risk level based on actual " +
               "document content. Consider factors like: regulatory exposure, financial impact, " +
               "legal consequences, and compliance with industry standards.";
    }
    
    private List<String> parseJsonArray(JsonNode node, String fieldName) {
        List<String> result = new ArrayList<>();
        if (node.has(fieldName) && node.get(fieldName).isArray()) {
            JsonNode arrayNode = node.get(fieldName);
            for (JsonNode item : arrayNode) {
                // For tags, truncate to ensure they fit in the database
                if ("tags".equals(fieldName)) {
                    result.add(truncateIfNeeded(item.asText(), MAX_TAG_LENGTH));
                } 
                // For flagged clauses, truncate to ensure they fit in the database
                else if ("flaggedClauses".equals(fieldName)) {
                    result.add(truncateIfNeeded(item.asText(), MAX_CLAUSE_LENGTH));
                } else {
                    result.add(item.asText());
                }
            }
        }
        return result;
    }
    
    private DocumentAnalysisResult extractWithFallback(String content) {
        // Simple fallback extraction when JSON parsing fails
        DocumentAnalysisResult.DocumentAnalysisResultBuilder builder = DocumentAnalysisResult.builder().success(true);
        
        // Extract risk score
        String riskScore = "MEDIUM"; // Default
        if (content.contains("HIGH") || content.contains("SEVERE") || content.contains("CRITICAL")) {
            riskScore = "HIGH";
        } else if (content.contains("LOW") || content.contains("MINIMAL") || content.contains("MINOR")) {
            riskScore = "LOW";
        }
        builder.riskScore(riskScore);
        
        // Extract compliance type
        String complianceType = "";
        for (String type : COMMON_COMPLIANCE_TYPES) {
            if (content.toUpperCase().contains(type.toUpperCase())) {
                complianceType = type;
                break;
            }
        }
        builder.complianceType(complianceType);
        
        // Extract jurisdiction
        String jurisdiction = "";
        List<String> commonJurisdictions = Arrays.asList("US", "USA", "EU", "UK", "GLOBAL", "INTERNATIONAL");
        for (String j : commonJurisdictions) {
            if (content.toUpperCase().contains(j)) {
                jurisdiction = j;
                break;
            }
        }
        builder.jurisdiction(jurisdiction);
        
        // Extract tags
        List<String> tags = new ArrayList<>();
        for (String type : COMMON_COMPLIANCE_TYPES) {
            if (content.toUpperCase().contains(type.toUpperCase()) && tags.size() < 5) {
                tags.add(type);
            }
        }
        builder.tags(tags);
        
        // Extract a simple summary (first 100 chars after "summary")
        int summaryIndex = content.indexOf("summary");
        if (summaryIndex >= 0 && summaryIndex + 10 < content.length()) {
            String summary = content.substring(summaryIndex + 10, Math.min(summaryIndex + 510, content.length()));
            builder.summary(truncateIfNeeded(summary, MAX_SUMMARY_LENGTH));
        } else {
            // If no summary found, create a generic one
            builder.summary("This document was analyzed with limited information. Please review manually.");
        }
        
        return builder.build();
    }
    
    /**
     * Truncates a string if it exceeds the specified maximum length.
     * 
     * @param text The text to truncate
     * @param maxLength The maximum allowed length
     * @return The truncated text
     */
    private String truncateIfNeeded(String text, int maxLength) {
        if (text == null) {
            return "";
        }
        
        if (text.length() <= maxLength) {
            return text;
        }
        
        // Truncate and add ellipsis
        return text.substring(0, maxLength - 3) + "...";
    }
} 