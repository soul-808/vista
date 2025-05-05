package com.vista.backend.controller;

import com.vista.backend.dto.ChatRequest;
import com.vista.backend.dto.ChatResponse;
import com.vista.backend.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/chat")
@Slf4j
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequest request) {
        // If no session ID is provided, create a new one
        String sessionId = request.getSessionId();
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }
        
        // Get username from request or from security context
        String username = determineUsername(request);
        log.debug("Processing chat request for user: {}", username);
        
        // Get answer from RAG-enabled chat service with rate limiting
        String answer = chatService.ask(sessionId, request.getQuestion(), username);
        
        // Prepare response with session ID for client to maintain conversation
        Map<String, Object> response = new HashMap<>();
        response.put("answer", answer);
        response.put("sessionId", sessionId);
        response.put("sourceType", "compliance-documents");
        response.put("message", "Answers are based on your organization's compliance documents using Retrieval-Augmented Generation");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Determine the username to use for rate limiting
     * Uses request username if provided, falls back to authenticated user, then anonymous
     */
    private String determineUsername(ChatRequest request) {
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