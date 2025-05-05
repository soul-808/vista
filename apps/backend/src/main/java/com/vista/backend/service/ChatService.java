package com.vista.backend.service;

import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.rag.RetrievalAugmentor;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.io.IOException;

@Service
@Slf4j
public class ChatService {

    private final ChatLanguageModel chatLanguageModel;
    private final RetrievalAugmentor retrievalAugmentor;
    private final ChatMemory templateChatMemory;
    private final Map<String, AssistantApi> sessionAssistants;
    private final SqlQueryService sqlQueryService;
    private final OpenAIService openAIService;
    
    // Rate limiting
    private static final int MAX_REQUESTS_PER_DAY = 20;
    private static final String UNLIMITED_USER = "bward808";
    private final Map<String, UserRateLimit> userRateLimits = new ConcurrentHashMap<>();

    public ChatService(ChatLanguageModel chatLanguageModel, 
                      RetrievalAugmentor retrievalAugmentor,
                      ChatMemory chatMemory,
                      SqlQueryService sqlQueryService,
                      OpenAIService openAIService) {
        this.chatLanguageModel = chatLanguageModel;
        this.retrievalAugmentor = retrievalAugmentor;
        this.templateChatMemory = chatMemory;
        this.sessionAssistants = new ConcurrentHashMap<>();
        this.sqlQueryService = sqlQueryService;
        this.openAIService = openAIService;
    }

    /**
     * Process a chat request from a user
     * 
     * @param sessionId The chat session ID
     * @param question The user's question
     * @param username The username of the requester
     * @return The assistant's response
     */
    public String ask(String sessionId, String question, String username) {
        try {
            // Check rate limit (skip check for unlimited user)
            if (!UNLIMITED_USER.equals(username) && !checkRateLimit(username)) {
                return "You've reached your daily limit of " + MAX_REQUESTS_PER_DAY + 
                       " chat requests. Please try again tomorrow or contact your administrator for assistance.";
            }
            
            // Process both data query and normal chat in parallel
            boolean isDataQ = isDataRequest(question);
            AssistantApi assistant = sessionAssistants.computeIfAbsent(sessionId, this::createNewAssistant);
            
            String chatResponse = null;
            String dataResponse = null;
            
            // Always process regular chat request
            chatResponse = assistant.chat(question);
            
            // Check if this might be a data request
            if (isDataQ) {
                try {
                    log.info("Also processing as data request: {}", question);
                    dataResponse = sqlQueryService.executeQueryFormatted(question);
                } catch (Exception e) {
                    log.warn("Failed to process as data request: {}", e.getMessage());
                    // If SQL query fails, we'll still have the chat response
                }
            }
            
            // If we got both responses, combine them
            if (dataResponse != null) {
                return combineResponses(chatResponse, dataResponse);
            }
            
            // Return just the chat response if no data
            return chatResponse;
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
    
    /**
     * For backward compatibility - defaults to anonymous user with rate limiting
     */
    public String ask(String sessionId, String question) {
        return ask(sessionId, question, "anonymous");
    }
    
    /**
     * Check if a user has exceeded their daily rate limit
     * 
     * @param username The username to check
     * @return True if the user is under their limit, false if they've exceeded it
     */
    private boolean checkRateLimit(String username) {
        LocalDate today = LocalDate.now();
        
        UserRateLimit userLimit = userRateLimits.computeIfAbsent(username, 
            u -> new UserRateLimit(today));
            
        // If it's a new day, reset the counter
        if (!userLimit.date.equals(today)) {
            userLimit.date = today;
            userLimit.count.set(0);
        }
        
        // Increment the counter and check if it exceeds the limit
        int newCount = userLimit.count.incrementAndGet();
        
        if (newCount > MAX_REQUESTS_PER_DAY) {
            log.info("User {} has exceeded the daily rate limit ({}/{})", 
                    username, newCount, MAX_REQUESTS_PER_DAY);
            return false;
        }
        
        log.debug("User {} request count: {}/{}", username, newCount, MAX_REQUESTS_PER_DAY);
        return true;
    }
    
    /**
     * Public method to check if a user is rate limited without incrementing their counter
     * Used by other services to check if a user should be allowed to make requests
     * 
     * @param username The username to check
     * @return True if the user is rate limited, false otherwise
     */
    public boolean isRateLimited(String username) {
        // Unlimited user is never rate limited
        if (UNLIMITED_USER.equals(username)) {
            return false;
        }
        
        LocalDate today = LocalDate.now();
        
        UserRateLimit userLimit = userRateLimits.get(username);
        if (userLimit == null) {
            return false; // No existing limit for this user
        }
        
        // If it's a new day, they're not rate limited
        if (!userLimit.date.equals(today)) {
            return false;
        }
        
        // Check if they've exceeded the limit (without incrementing)
        return userLimit.count.get() >= MAX_REQUESTS_PER_DAY;
    }

    /**
     * Inner class to track rate limits per user
     */
    private static class UserRateLimit {
        private LocalDate date;
        private final AtomicInteger count;
        
        public UserRateLimit(LocalDate date) {
            this.date = date;
            this.count = new AtomicInteger(0);
        }
    }

    /**
     * Detect if the user is asking for database information that would be best
     * served by a SQL query rather than retrieving documents
     * 
     * @param question The user's question
     * @return True if this is a data request, false otherwise
     */
    private boolean isDataRequest(String question) {
        try {
            // We'll use a simple prompt to determine if this is a data request
            String prompt = """
                You are an expert at determining if a user question should be answered using SQL database queries.
                
                Instructions:
                1. Analyze the user question
                2. Respond with ONLY "true" if the question is asking for compliance data analysis, metrics, statistics, or database queries about compliance documents
                3. Respond with ONLY "false" if the question is asking for general information, explanations, user data, or doesn't require data
                4. Only answer with "true" or "false" - no other text
                
                Example data questions that should return "true":
                - "How many high risk documents were uploaded last month?"
                - "Show me documents by compliance type"
                - "What's the distribution of risk scores across jurisdictions?"
                - "Count how many compliance documents were processed"
                
                Example non-data questions that should return "false":
                - "What is compliance management?"
                - "Explain how to interpret risk scores"
                - "What are the key requirements for KYC compliance?"
                - "Tell me about the Vista platform features"
                - "Who are the users with admin access?"
                - "Show me user activity metrics"
                
                User question: """ + question;
            
            String response = openAIService.callOpenAI(prompt);
            String result = openAIService.extractContentFromResponse(response).trim().toLowerCase();
            
            return "true".equals(result);
        } catch (IOException e) {
            log.error("Error determining if this is a data request: {}", e.getMessage());
            // On error, default to treating it as a regular chat message
            return false;
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

    /**
     * Combines chat and data responses into a unified, concise answer
     * 
     * @param chatResponse The response from the AI chat
     * @param dataResponse The formatted data response
     * @return A combined response with insights from both sources
     */
    private String combineResponses(String chatResponse, String dataResponse) {
        try {
            // Prompt to create a concise combined response with specific formatting
            String prompt = String.format("""
                Talk like a regular person in conversation unless asked for something require one of the principles.
                Dont give me more than I asked for.

                You are an expert at synthesizing information from multiple sources into concise insights.
                
                CHAT RESPONSE: 
                %s
                
                SQL DATA:
                %s
                
                Instructions:
                Format your response following these specific style principles (only use 1 or many when it makes sense):
                
                1. Core Structure (Subtle ABT Framework):
                   • Start with clear situation + context (And...)
                   • Identify challenge or insight (But...)
                   • Deliver resolution or action steps (Therefore...)

                2. Visual Hierarchy:
                   • Use clean spacing between logical sections
                   • Limit to 3-4 key points with breathing room
                   • Break text into 2-3 line paragraphs maximum
                   
                3. Statistics Presentation:
                   • 📊 Simple, impactful stat callouts
                   • Use sports-style formatting: 
                     WIN RATE: 86%% | RISK SCORE: 24 | TREND: ↑12%%
                   • Progress indicators: [■■■□□□] 52%%
                   
                4. Risk Indicators (use judiciously):
                   • 🔴 Critical (requires immediate action)
                   • 🟠 Moderate (needs attention)
                   • 🟢 Healthy (on target)
                   
                5. Copy Psychology:
                   • Frame achievements as wins
                   • Position necessary actions as opportunities
                   • Create momentum with clear next steps
                   • For urgent items: create concise, high-contrast alerts
                   
                6. Reduce Cognitive Load:
                   • One idea per paragraph
                   • Use selective bolding for scanning
                   • Remove all non-essential information
                
                General Guidelines:
                1. Only include the most important insights
                2. Statistics should be presented in an easy-to-scan format
                3. Use markdown for formatting where appropriate
                4. Be concise and direct
                5. Maximum length: 250 words

                Add space lines between each section
                Keep your responses concise and to the point

                [!important]
                Dont give me more than I asked for.
                If I ask how many where this then just say "There were x of this in this time period" or something like that.
                If I ask for a list of something then just give them the list.
                If ask for more then you can add relevation peieces from the struture I gave you.

                [!important]
                Talk like a regular person in conversation unless asked for something require one of the principles.
                
                RESPONSE:
                """, chatResponse, dataResponse);
            
            String response = openAIService.callOpenAI(prompt);
            return openAIService.extractContentFromResponse(response);
        } catch (Exception e) {
            log.error("Error combining responses: {}", e.getMessage());
            // Fall back to showing both responses separately if combination fails
            return "Based on your question, I found some relevant information:\n\n" + 
                   chatResponse + "\n\n" +
                   "I also found this data that might help:\n\n" + dataResponse;
        }
    }

    @SystemMessage("""
            You are Vista AI, an intelligent assistant for compliance and risk management.
            Answer questions based on the retrieved documents about compliance, risk metrics, and infrastructure status.
            Always provide concise, accurate responses based solely on the provided context.
            Focus on providing explanations, context, and qualitative information rather than raw statistics.
            If you don't know the answer or the information is not in the context, say so politely.
            For questions about compliance metrics or statistics, note that your answer will be enhanced with actual data from our database.
            
            Format your responses with a clear structure:
            - Begin with context and situation
            - Identify key insights or challenges
            - Provide resolution or action steps
            
            Use visual cues for risk levels when appropriate:
            - 🔴 Critical issues requiring immediate action
            - 🟠 Moderate concerns needing attention
            - 🟢 Healthy metrics on target
            
            Keep your responses concise with:
            - Selective bolding for key points
            - Short 2-3 line paragraphs
            - One idea per paragraph
            - Clean spacing between sections

            Add two line breaks between each section
            Keep your responses concise and to the point

            [!important]
            Dont give me more than I asked for.
            If I ask how many where this then just say "There were x of this in this time period" or something like that.
            If I ask for a list of something then just give them the list.
            If ask for more then you can add relevation peieces from the struture I gave you.
            """)
    interface AssistantApi {
        String chat(String userMessage);
    }
} 