package com.vista.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.vista.backend.dto.NaturalLanguageQueryRequest;
import com.vista.backend.service.SqlQueryService;
import com.vista.backend.service.ChatService;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * Controller for handling natural language queries
 * Converts natural language to SQL and executes the queries
 */
@RestController
@RequestMapping("/api/query")
@Slf4j
public class QueryController {

    private final SqlQueryService sqlQueryService;
    private final ChatService chatService;
    private static final String UNLIMITED_USER = "bward808";

    @Autowired
    public QueryController(SqlQueryService sqlQueryService, ChatService chatService) {
        this.sqlQueryService = sqlQueryService;
        this.chatService = chatService;
        log.info("QueryController initialized");
    }

    /**
     * Execute a natural language query against the database
     * 
     * @param request The natural language query request
     * @return The query results
     */
    @PostMapping
    public ResponseEntity<?> executeQuery(@RequestBody NaturalLanguageQueryRequest request) {
        String username = determineUsername(request);
        log.info("Received natural language query from user {}: {}", username, request.getQuery());
        
        // Check rate limit (bypass for unlimited user)
        if (!UNLIMITED_USER.equals(username) && chatService.isRateLimited(username)) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Rate limit exceeded");
            errorResponse.put("message", "You've reached your daily limit of queries. Please try again tomorrow.");
            return ResponseEntity.status(429).body(errorResponse);
        }
        
        try {
            List<Map<String, Object>> results = sqlQueryService.executeNaturalLanguageQuery(request.getQuery());
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            log.error("Error executing query: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get the SQL that would be generated for a natural language query
     * Useful for debugging or explaining the query to users
     * 
     * @param request The natural language query request
     * @return The generated SQL query
     */
    @PostMapping("/explain")
    public ResponseEntity<?> explainQuery(@RequestBody NaturalLanguageQueryRequest request) {
        String username = determineUsername(request);
        log.info("Received request to explain query from user {}: {}", username, request.getQuery());
        
        // Check rate limit (bypass for unlimited user)
        if (!UNLIMITED_USER.equals(username) && chatService.isRateLimited(username)) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Rate limit exceeded");
            errorResponse.put("message", "You've reached your daily limit of queries. Please try again tomorrow.");
            return ResponseEntity.status(429).body(errorResponse);
        }
        
        try {
            String sql = sqlQueryService.getSqlForNaturalLanguageQuery(request.getQuery());
            return ResponseEntity.ok(sql);
        } catch (Exception e) {
            log.error("Error explaining query: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Determine the username to use for rate limiting
     * Uses request username if provided, falls back to authenticated user, then anonymous
     */
    private String determineUsername(NaturalLanguageQueryRequest request) {
        // If username is provided in the request, use it
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            return request.getUsername();
        }
        
        // Try to get username from security context
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                !authentication.getPrincipal().equals("anonymousUser")) {
                return authentication.getName();
            }
        } catch (Exception e) {
            log.warn("Could not determine authenticated user: {}", e.getMessage());
        }
        
        // Default to anonymous user
        return "anonymous";
    }
} 