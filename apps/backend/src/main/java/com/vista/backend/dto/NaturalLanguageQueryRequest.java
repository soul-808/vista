package com.vista.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for natural language query requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NaturalLanguageQueryRequest {
    private String query;
    private String username;
} 