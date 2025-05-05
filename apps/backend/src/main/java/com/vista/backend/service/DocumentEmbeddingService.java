package com.vista.backend.service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class DocumentEmbeddingService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final DocumentSplitter documentSplitter;

    public DocumentEmbeddingService(EmbeddingModel embeddingModel, 
                                  EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;
        
        log.info("DocumentEmbeddingService initialized with embeddingModel: {} and embeddingStore: {}", 
                 embeddingModel.getClass().getSimpleName(), 
                 embeddingStore.getClass().getSimpleName());
        
        // Configure document splitter with reasonable defaults
        this.documentSplitter = DocumentSplitters.recursive(1000, 200);
    }

    /**
     * Processes a document, splits it into chunks, embeds each chunk, and stores in Pinecone
     * 
     * @param content The document content as text
     * @param documentId A unique identifier for the document
     * @param metadataMap Additional metadata to store with each chunk
     * @return The number of chunks embedded and stored
     */
    public int processDocument(String content, String documentId, Map<String, String> metadataMap) {
        log.info("Processing document: {} with content length: {}", documentId, content.length());
        
        try {
            // Create metadata
            Metadata metadata = new Metadata();
            if (metadataMap != null) {
                log.info("Adding metadata: {}", metadataMap);
                metadataMap.forEach(metadata::add);
            }
            metadata.add("documentId", documentId);
            
            // Parse text content into a document
            Document document = new Document(content, metadata);
            
            // Split document into segments
            List<TextSegment> segments = documentSplitter.split(document);
            log.info("Document split into {} segments", segments.size());
            
            if (segments.isEmpty()) {
                log.warn("No segments were created from document: {}", documentId);
                return 0;
            }
            
            // Log first segment for debugging
            if (!segments.isEmpty()) {
                TextSegment firstSegment = segments.get(0);
                log.info("First segment text (truncated): {}", 
                        firstSegment.text().length() > 100 ? 
                            firstSegment.text().substring(0, 100) + "..." : 
                            firstSegment.text());
                log.info("First segment metadata: {}", firstSegment.metadata());
            }
            
            try {
                // Generate embeddings
                log.info("Generating embeddings for {} segments", segments.size());
                Response<List<Embedding>> embeddingsResponse = embeddingModel.embedAll(segments);
                List<Embedding> embeddings = embeddingsResponse.content();
                log.info("Successfully generated {} embeddings", embeddings.size());
                
                // Store embeddings and segments in Pinecone
                log.info("Storing embeddings and segments in Pinecone");
                embeddingStore.addAll(embeddings, segments);
                log.info("Successfully stored {} segments in Pinecone", segments.size());
                
                return segments.size();
            } catch (Exception e) {
                log.error("Error during embedding generation or storage: {}", e.getMessage(), e);
                log.error("Exception class: {}", e.getClass().getName());
                if (e.getCause() != null) {
                    log.error("Caused by: {}", e.getCause().getMessage(), e.getCause());
                }
                throw e;
            }
        } catch (Exception e) {
            log.error("Error processing document: {}", e.getMessage(), e);
            throw e;
        }
    }
} 