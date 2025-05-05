package com.vista.backend.service;

import com.vista.backend.dto.ChatRequest;
import com.vista.backend.dto.ComplianceDocumentDTO;
import com.vista.backend.entity.User;
import com.vista.backend.repository.UserRepository;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ComplianceDocumentRagIntegrationTest {

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private DocumentEmbeddingService documentEmbeddingService;

    @MockBean
    private EmbeddingStore<TextSegment> embeddingStore;

    @MockBean
    private EmbeddingModel embeddingModel;

    @MockBean
    private ChatLanguageModel chatLanguageModel;

    @MockBean
    private ContentRetriever contentRetriever;

    @MockBean
    private ComplianceAnalysisService complianceAnalysisService;

    @Autowired
    private DocumentUploadService documentUploadService;

    @Autowired
    private ChatService chatService;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setRole("USER");

        // Set up security context
        Authentication auth = new UsernamePasswordAuthenticationToken(testUser.getUsername(), null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Mock user repository
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Mock content retrieval from Pinecone
        when(contentRetriever.retrieve(any())).thenReturn(
                List.of(new Content("This is a test compliance document with a HIGH risk score."))
        );

        // Mock OpenAI response
        when(chatLanguageModel.generate(anyList())).thenReturn(
                Response.from(dev.langchain4j.data.message.AiMessage.from(
                        "Based on the retrieved documents, the compliance document has a HIGH risk score."
                ))
        );

        // Mock document analysis
        when(complianceAnalysisService.analyzeDocument(any(), any())).thenReturn(
                com.vista.backend.dto.DocumentAnalysisResult.builder()
                        .success(true)
                        .riskScore("HIGH")
                        .complianceType("KYC")
                        .jurisdiction("US")
                        .summary("This is a test document")
                        .build()
        );

        // Mock document embedding
        when(documentEmbeddingService.processDocument(any(), any(), any())).thenReturn(5);
    }

    @Test
    void testDocumentUploadAndChat() throws Exception {
        // 1. Upload a document
        String content = "This is a test compliance document that contains important financial regulations.";
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-doc.txt",
                "text/plain", 
                content.getBytes()
        );

        ComplianceDocumentDTO uploadedDoc = documentUploadService.uploadDocument(file, "KYC");
        assertNotNull(uploadedDoc);
        assertNotNull(uploadedDoc.getId());

        // Verify document was analyzed
        verify(complianceAnalysisService, times(1)).analyzeDocument(any(), any());

        // Verify document was embedded in Pinecone
        verify(documentEmbeddingService, times(1)).processDocument(any(), any(), any());

        // 2. Test chat retrieval based on uploaded document
        String response = chatService.ask("test-session", "What is the risk score of our compliance documents?");
        
        assertNotNull(response);
        assertTrue(response.contains("HIGH"));
        
        // Verify retrieval was performed
        verify(contentRetriever, times(1)).retrieve(any());
        
        // Verify chat model was used
        verify(chatLanguageModel, times(1)).generate(anyList());
    }
} 