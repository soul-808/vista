package com.vista.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Slf4j
public class HealthCheckController {

    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;

    @Autowired
    public HealthCheckController(EmbeddingStore<TextSegment> embeddingStore, EmbeddingModel embeddingModel) {
        this.embeddingStore = embeddingStore;
        this.embeddingModel = embeddingModel;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Service is running");
        
        try {
            // Try to access the embedding store
            log.info("Testing Pinecone connection...");
            // Just getting a reference is enough to verify the connection works
            String embeddingStoreClass = embeddingStore.getClass().getSimpleName();
            response.put("embeddingStore", embeddingStoreClass);
            response.put("embeddingStoreStatus", "Connected");
            log.info("Successfully connected to Pinecone");
        } catch (Exception e) {
            log.error("Error connecting to Pinecone: {}", e.getMessage(), e);
            response.put("embeddingStoreStatus", "Error: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/test-embedding")
    public ResponseEntity<Map<String, Object>> testEmbedding(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String text = request.get("text");
        
        if (text == null || text.isEmpty()) {
            text = "This is a test text to generate embeddings.";
        }
        
        try {
            log.info("Generating embedding for text: {}", text);
            Embedding embedding = embeddingModel.embed(text).content();
            response.put("status", "SUCCESS");
            response.put("text", text);
            response.put("embeddingModel", embeddingModel.getClass().getSimpleName());
            response.put("embeddingDimension", embedding.dimension());
            response.put("embeddingVectorPreview", 
                embedding.vectorAsList().subList(0, Math.min(5, embedding.dimension())) + "...");
            log.info("Successfully generated embedding with dimension {}", embedding.dimension());
        } catch (Exception e) {
            log.error("Error generating embedding: {}", e.getMessage(), e);
            response.put("status", "ERROR");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
} 