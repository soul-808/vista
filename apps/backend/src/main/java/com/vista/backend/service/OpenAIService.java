package com.vista.backend.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OpenAIService {

    @Value("${openai.api.key:}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${openai.api.model:gpt-4-turbo}")
    private String model;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public OpenAIService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Calls the OpenAI API with the provided prompt and returns the raw response.
     * 
     * @param prompt The prompt to send to OpenAI
     * @return The raw response from OpenAI
     * @throws IOException If there's an error communicating with the API
     */
    public String callOpenAI(String prompt) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(message);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);
        return response.getBody();
    }

    /**
     * Extracts the content from an OpenAI API response.
     * 
     * @param response The raw API response
     * @return The extracted content string
     * @throws IOException If there's an error parsing the response
     */
    public String extractContentFromResponse(String response) throws IOException {
        JsonNode rootNode = objectMapper.readTree(response);
        
        JsonNode choicesNode = rootNode.get("choices");
        if (choicesNode == null || choicesNode.isEmpty()) {
            throw new IOException("No content received from AI");
        }
        
        return choicesNode.get(0).get("message").get("content").asText();
    }
    
    /**
     * Attempts to extract a JSON object from content that may contain both text and JSON.
     * 
     * @param content The content string from OpenAI
     * @return The parsed JsonNode or null if no valid JSON found
     */
    public JsonNode extractJsonFromContent(String content) {
        try {
            // Try to find JSON within the content
            int jsonStart = content.indexOf('{');
            int jsonEnd = content.lastIndexOf('}');
            
            if (jsonStart >= 0 && jsonEnd > jsonStart) {
                String jsonContent = content.substring(jsonStart, jsonEnd + 1);
                return objectMapper.readTree(jsonContent);
            }
        } catch (Exception e) {
            log.warn("Failed to parse JSON from content: {}", e.getMessage());
        }
        return null;
    }
} 