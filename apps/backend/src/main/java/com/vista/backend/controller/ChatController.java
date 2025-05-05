package com.vista.backend.controller;

import com.vista.backend.dto.ChatRequest;
import com.vista.backend.dto.ChatResponse;
import com.vista.backend.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/chat")
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
        
        // Get answer from RAG-enabled chat service
        String answer = chatService.ask(sessionId, request.getQuestion());
        
        // Prepare response with session ID for client to maintain conversation
        Map<String, Object> response = new HashMap<>();
        response.put("answer", answer);
        response.put("sessionId", sessionId);
        response.put("sourceType", "compliance-documents");
        response.put("message", "Answers are based on your organization's compliance documents using Retrieval-Augmented Generation");
        
        return ResponseEntity.ok(response);
    }
} 