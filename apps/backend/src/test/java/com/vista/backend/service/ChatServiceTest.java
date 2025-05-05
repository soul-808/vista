package com.vista.backend.service;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.rag.DefaultRetrievalAugmentor;
import dev.langchain4j.rag.RetrievalAugmentor;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ChatServiceTest {

    @Mock
    private ChatLanguageModel chatLanguageModel;

    @Mock
    private ContentRetriever contentRetriever;

    @Mock
    private SqlQueryService sqlQueryService;

    @Mock
    private OpenAIService openAIService;

    private RetrievalAugmentor retrievalAugmentor;
    private ChatMemory chatMemory;
    private ChatService chatService;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        
        // Create a test chat memory
        chatMemory = MessageWindowChatMemory.builder()
                .maxMessages(10)
                .build();
                
        // Create retrieval augmentor with mocked content retriever
        retrievalAugmentor = DefaultRetrievalAugmentor.builder()
                .contentRetriever(contentRetriever)
                .build();
        
        // Mock retrieval response to return some content
        when(contentRetriever.retrieve(any())).thenReturn(
                Collections.singletonList(new Content("This is a test content about compliance.")));
                
        // Mock chat model to return a predefined response
        Response<AiMessage> response = Response.from(new AiMessage("Based on the retrieved documents, I can provide you this answer."));
        when(chatLanguageModel.generate(anyList())).thenReturn(response);
        
        // Mock SqlQueryService and OpenAIService as needed
        when(sqlQueryService.executeQueryFormatted(any())).thenReturn("SQL data response");
        when(openAIService.callOpenAI(any())).thenReturn("true");
        when(openAIService.extractContentFromResponse(any())).thenReturn("true");
        
        // Initialize service with all required dependencies
        chatService = new ChatService(chatLanguageModel, retrievalAugmentor, chatMemory, sqlQueryService, openAIService);
    }

    @Test
    void testAskQuestion() {
        // Test asking a question
        String response = chatService.ask("test-session", "What are our compliance risks?");
        
        // Verify that we received a response
        assertNotNull(response);
        
        // Verify content retriever was called
        verify(contentRetriever).retrieve(any());
        
        // Verify language model was used
        verify(chatLanguageModel).generate(anyList());
    }

    @Test
    void testMultipleTurns() {
        // First turn
        chatService.ask("test-session-2", "What are our compliance risks?");
        
        // Second turn - should maintain conversation context
        String response = chatService.ask("test-session-2", "Tell me more about them");
        
        // Verify we got a response
        assertNotNull(response);
        
        // Verify content retriever and language model were called again
        verify(contentRetriever).retrieve(any());
        verify(chatLanguageModel).generate(anyList());
    }
} 