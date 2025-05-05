package com.vista.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.BadSqlGrammarException;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

/**
 * Service for executing natural language to SQL conversions
 * Uses OpenAI to process natural language queries and convert them to SQL
 */
@Service
@Slf4j
public class SqlQueryService {

    private final JdbcTemplate jdbcTemplate;
    private final OpenAIService openAIService;
    private final ObjectMapper objectMapper;
    
    // Database schema information
    private static final String DB_SCHEMA = """
        compliance_docs:
          - id (UUID): primary key
          - filename (TEXT): name of the document file
          - uploaded_by_user_id (BIGINT): foreign key reference 
          - risk_score (TEXT): risk score of the document (LOW, MEDIUM, HIGH)
          - compliance_type (TEXT): type of compliance (KYC & AML, Capital Reporting & Payment Rules, etc.)
          - source_system (TEXT): originating system
          - jurisdiction (TEXT): geographic region (US, EU, Global, etc.)
          - tags (TEXT[]): array of tags associated with the document
          - flagged_clauses (JSONB): list of flagged clauses as JSON
          - notes (TEXT): additional notes
          - created_at (TIMESTAMP): when the document was created
        
        audit_logs:
          - id (UUID): primary key
          - action (TEXT): the action performed (VIEW, EDIT, DELETE, etc.)
          - document_id (UUID): reference to the compliance_docs table
          - timestamp (TIMESTAMP): when the action occurred
          - details (JSONB): additional details about the action
        """;
    
    private static final String PROMPT_TEMPLATE = """
        You are an expert SQL query generator for a PostgreSQL database focused on compliance documents.
        
        DATABASE SCHEMA:
        %s
        
        INSTRUCTIONS:
        1. Convert the natural language query to a valid PostgreSQL query
        2. Only return the SQL query without any explanations or markdown
        3. Use appropriate joins if multiple tables are needed
        4. Limit results to 100 rows maximum using LIMIT
        5. For full-text search use ILIKE with %% wildcards
        6. Use COUNT, AVG, SUM, GROUP BY for aggregate questions
        7. Always ORDER BY relevant columns (created_at DESC by default)
        8. Never include explanations, only return the SQL query
        9. IMPORTANT: DO NOT attempt to access or join with any user tables
        
        Examples:
        - "Show documents with high risk score" → SELECT * FROM compliance_docs WHERE risk_score = 'HIGH' ORDER BY created_at DESC LIMIT 100
        - "Count documents by compliance type" → SELECT compliance_type, COUNT(*) FROM compliance_docs GROUP BY compliance_type ORDER BY COUNT(*) DESC LIMIT 100
        - "Show recent audit logs for documents" → SELECT a.*, c.filename FROM audit_logs a JOIN compliance_docs c ON a.document_id = c.id ORDER BY a.timestamp DESC LIMIT 100
        
        QUERY: %s
        
        SQL:
        """;
    
    @Autowired
    public SqlQueryService(JdbcTemplate jdbcTemplate, 
                          OpenAIService openAIService,
                          ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.openAIService = openAIService;
        this.objectMapper = objectMapper;
        
        log.info("SqlQueryService initialized with JdbcTemplate and OpenAIService");
    }
    
    /**
     * Convert a natural language query to SQL and execute it
     * 
     * @param naturalLanguageQuery The natural language query
     * @return A list of map results from executing the SQL query
     */
    public List<Map<String, Object>> executeNaturalLanguageQuery(String naturalLanguageQuery) {
        log.info("Executing natural language query: {}", naturalLanguageQuery);
        
        // First, generate the SQL query and log it
        String sqlQuery = generateSqlQuery(naturalLanguageQuery);
        log.info("Generated SQL query: {}", sqlQuery);
        
        // Validate the SQL for safety
        validateSqlQuery(sqlQuery);
        
        // Execute the SQL query
        try {
            return jdbcTemplate.queryForList(sqlQuery);
        } catch (BadSqlGrammarException e) {
            log.error("Error executing SQL query: {}", e.getMessage());
            throw new RuntimeException("Failed to execute the generated SQL query", e);
        }
    }
    
    /**
     * Generate a SQL query from a natural language question
     * 
     * @param query The natural language query
     * @return The generated SQL query
     */
    private String generateSqlQuery(String query) {
        try {
            // Format the prompt with the schema and the query
            String prompt = String.format(PROMPT_TEMPLATE, DB_SCHEMA, query);
            
            // Call OpenAI
            String response = openAIService.callOpenAI(prompt);
            
            // Extract the content from the response
            String sql = openAIService.extractContentFromResponse(response);
            
            // Clean up any markdown or extra content
            return cleanupSqlResponse(sql);
        } catch (IOException e) {
            log.error("Error generating SQL query: {}", e.getMessage());
            throw new RuntimeException("Failed to generate SQL query", e);
        }
    }
    
    /**
     * Clean up the SQL response to ensure we get only the SQL query
     * 
     * @param response The response from the AI
     * @return The cleaned SQL query
     */
    private String cleanupSqlResponse(String response) {
        // Remove any markdown code blocks
        String cleaned = response.replaceAll("```sql", "").replaceAll("```", "").trim();
        
        // Remove explanations before or after the query if any
        if (cleaned.toLowerCase().contains("select ")) {
            int selectIndex = cleaned.toLowerCase().indexOf("select ");
            cleaned = cleaned.substring(selectIndex);
            
            // If there's any explanation after the query, remove it
            if (cleaned.contains(";")) {
                cleaned = cleaned.substring(0, cleaned.indexOf(";") + 1);
            }
        }
        
        return cleaned;
    }
    
    /**
     * Get the raw SQL query that would be generated for a natural language query
     * Useful for debugging or showing users the generated SQL
     * 
     * @param naturalLanguageQuery The natural language query
     * @return The generated SQL query
     */
    public String getSqlForNaturalLanguageQuery(String naturalLanguageQuery) {
        log.info("Getting SQL for natural language query: {}", naturalLanguageQuery);
        
        // Generate the SQL query
        String generatedSql = generateSqlQuery(naturalLanguageQuery);
        
        // Validate the SQL for safety
        validateSqlQuery(generatedSql);
        
        return generatedSql;
    }
    
    /**
     * Validate the generated SQL query to ensure it's safe to execute
     * This is a basic implementation - a production system would need more robust validation
     * 
     * @param sqlQuery The SQL query to validate
     * @throws IllegalArgumentException if the query is invalid or potentially dangerous
     */
    private void validateSqlQuery(String sqlQuery) {
        // Convert to lowercase for easier checking
        String lowerQuery = sqlQuery.toLowerCase();
        
        // Check for dangerous operations
        if (lowerQuery.contains("drop ") || 
            lowerQuery.contains("truncate ") || 
            lowerQuery.contains("delete ") || 
            lowerQuery.contains("update ") || 
            lowerQuery.contains("insert ")) {
            throw new IllegalArgumentException("Query contains unauthorized operations. Only SELECT queries are allowed.");
        }
        
        // Ensure the query starts with SELECT
        if (!lowerQuery.trim().startsWith("select ")) {
            throw new IllegalArgumentException("Only SELECT queries are allowed.");
        }
        
        // Check for attempts to access user data
        if (lowerQuery.contains("users") || 
            lowerQuery.contains("user table") || 
            lowerQuery.contains("user_") || 
            lowerQuery.contains("_user") ||
            lowerQuery.contains("password") || 
            lowerQuery.contains("email") ||
            lowerQuery.contains("auth") ||
            lowerQuery.contains("login")) {
            throw new IllegalArgumentException("Queries related to user data are not allowed. Please focus on compliance data only.");
        }
        
        log.info("SQL query validation passed");
    }
    
    /**
     * A utility method to be used by other services that need to access NL2SQL functionality
     * Returns the query results as a formatted string for easy inclusion in chat responses
     *
     * @param naturalLanguageQuery The natural language query
     * @return A formatted string representation of the query results
     */
    public String executeQueryFormatted(String naturalLanguageQuery) {
        try {
            // Get the SQL query
            String sqlQuery = getSqlForNaturalLanguageQuery(naturalLanguageQuery);
            
            // Execute the query
            List<Map<String, Object>> results = executeNaturalLanguageQuery(naturalLanguageQuery);
            
            // Format the results as a table in markdown
            StringBuilder formattedResults = new StringBuilder();
            
            // Only include the SQL if debugging is needed
            // formattedResults.append("Generated SQL: \n```sql\n").append(sqlQuery).append("\n```\n\n");
            
            if (results.isEmpty()) {
                formattedResults.append("No data found matching your criteria.");
                return formattedResults.toString();
            }
            
            // Get headers from first result
            Map<String, Object> firstRow = results.get(0);
            
            // Add headers
            formattedResults.append("| ");
            for (String key : firstRow.keySet()) {
                formattedResults.append(key).append(" | ");
            }
            formattedResults.append("\n| ");
            
            // Add separator row
            for (int i = 0; i < firstRow.keySet().size(); i++) {
                formattedResults.append("--- | ");
            }
            formattedResults.append("\n");
            
            // Limit the number of rows we return (keep data concise)
            int maxRows = Math.min(10, results.size());
            
            // Add data rows
            for (int i = 0; i < maxRows; i++) {
                Map<String, Object> row = results.get(i);
                formattedResults.append("| ");
                for (Object value : row.values()) {
                    formattedResults.append(value == null ? "null" : value.toString()).append(" | ");
                }
                formattedResults.append("\n");
            }
            
            // Add a note if we truncated results
            if (results.size() > maxRows) {
                formattedResults.append("\n_Showing ").append(maxRows).append(" of ").append(results.size()).append(" results_");
            }
            
            return formattedResults.toString();
        } catch (Exception e) {
            log.error("Error executing formatted query: {}", e.getMessage());
            return "Error executing query: " + e.getMessage();
        }
    }
} 