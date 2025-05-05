package com.vista.backend.service;

import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.rag.RetrievalAugmentor;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class ChatService {

    private final ChatLanguageModel chatLanguageModel;
    private final RetrievalAugmentor retrievalAugmentor;
    private final ChatMemory templateChatMemory;
    private final Map<String, AssistantApi> sessionAssistants;

    public ChatService(ChatLanguageModel chatLanguageModel, 
                      RetrievalAugmentor retrievalAugmentor,
                      ChatMemory chatMemory) {
        this.chatLanguageModel = chatLanguageModel;
        this.retrievalAugmentor = retrievalAugmentor;
        this.templateChatMemory = chatMemory;
        this.sessionAssistants = new ConcurrentHashMap<>();
    }

    public String ask(String sessionId, String question) {
        try {
            AssistantApi assistant = sessionAssistants.computeIfAbsent(sessionId, this::createNewAssistant);
            return assistant.chat(question);
        } catch (Exception e) {
            log.error("Error processing chat request for session {}: {}", sessionId, e.getMessage(), e);
            if (e.getMessage() != null && e.getMessage().contains("Pinecone") || 
                e.getCause() != null && e.getCause().getMessage() != null && 
                e.getCause().getMessage().contains("Pinecone")) {
                return "I'm having trouble retrieving the necessary information. There might be an issue with the knowledge retrieval system. Please try again in a moment.";
            }
            return "I encountered an error while processing your request. Please try again or rephrase your question.";
        }
    }

    private AssistantApi createNewAssistant(String sessionId) {
        // Create a new chat memory for this session
        ChatMemory newMemory = MessageWindowChatMemory.builder()
                .maxMessages(20)
                .build();
                
        return AiServices.builder(AssistantApi.class)
                .chatLanguageModel(chatLanguageModel)
                .chatMemory(newMemory)
                .retrievalAugmentor(retrievalAugmentor)
                .build();
    }

    @SystemMessage("""
            You are Vista AI, an intelligent assistant for compliance and risk management.
            Answer questions based on the retrieved documents about compliance, risk metrics, and infrastructure status.
            Always provide concise, accurate responses based solely on the provided context.
            If you don't know the answer or the information is not in the context, say so politely.
            """)
    interface AssistantApi {
        String chat(String userMessage);
    }
} 