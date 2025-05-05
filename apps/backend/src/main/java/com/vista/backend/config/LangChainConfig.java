package com.vista.backend.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.rag.DefaultRetrievalAugmentor;
import dev.langchain4j.rag.RetrievalAugmentor;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pinecone.PineconeEmbeddingStore;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class LangChainConfig {

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Value("${openai.api.model}")
    private String openAiModel;

    @Value("${pinecone.api.key}")
    private String pineconeApiKey;

    @Value("${pinecone.api.environment}")
    private String pineconeEnvironment;

    @Value("${pinecone.api.projectName}")
    private String pineconeProjectId;

    @Value("${pinecone.api.indexName}")
    private String pineconeIndexName;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        log.info("Initializing ChatLanguageModel with model: {}", openAiModel);
        return OpenAiChatModel.builder()
                .apiKey(openAiApiKey)
                .modelName(openAiModel)
                .temperature(0.7)
                .build();
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        log.info("Initializing EmbeddingModel with model: text-embedding-3-small");
        return OpenAiEmbeddingModel.builder()
                .apiKey(openAiApiKey)
                .modelName("text-embedding-3-small")
                .dimensions(1024)
                .build();
    }

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore(EmbeddingModel embeddingModel) {
        log.info("Initializing PineconeEmbeddingStore with environment: {}, index: {}", 
                  pineconeEnvironment, pineconeIndexName);
        log.info("\n ###Pinecone projectId (delimited): >{}<", pineconeProjectId);
        log.info("\n#######################\n");
        String maskedApiKey = pineconeApiKey.substring(0, 4) + "..." + 
                             pineconeApiKey.substring(pineconeApiKey.length() - 4);
        log.info("Using Pinecone API key: {}", maskedApiKey);
        try {
            PineconeEmbeddingStore store = PineconeEmbeddingStore.builder()
                .apiKey(pineconeApiKey)
                .environment(pineconeEnvironment)
                .projectId(pineconeProjectId)
                .index(pineconeIndexName)
                .build();
            log.info("Successfully initialized PineconeEmbeddingStore");
            return store;
        } catch (Exception e) {
            log.error("Failed to initialize PineconeEmbeddingStore: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Bean
    public ContentRetriever contentRetriever(EmbeddingStore<TextSegment> embeddingStore, EmbeddingModel embeddingModel) {
        log.info("Initializing ContentRetriever");
        return EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)
                .minScore(0.6)
                .build();
    }

    @Bean
    public RetrievalAugmentor retrievalAugmentor(ContentRetriever contentRetriever) {
        log.info("Initializing RetrievalAugmentor");
        return DefaultRetrievalAugmentor.builder()
                .contentRetriever(contentRetriever)
                .build();
    }

    @Bean
    public ChatMemory chatMemory() {
        log.info("Initializing ChatMemory with maxMessages: 20");
        return MessageWindowChatMemory.builder()
                .maxMessages(20)
                .build();
    }
} 