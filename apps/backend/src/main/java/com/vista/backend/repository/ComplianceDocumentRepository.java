package com.vista.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import com.vista.backend.entity.ComplianceDocument;

@Repository
public interface ComplianceDocumentRepository extends JpaRepository<ComplianceDocument, UUID> {

    List<ComplianceDocument> findByRiskScoreOrderByCreatedAtDesc(String riskScore);
    
    List<ComplianceDocument> findByComplianceTypeOrderByCreatedAtDesc(String complianceType);
    
    List<ComplianceDocument> findByJurisdictionOrderByCreatedAtDesc(String jurisdiction);
    
    @Query(value = "SELECT * FROM compliance_docs WHERE :tag = ANY(tags) ORDER BY created_at DESC", nativeQuery = true)
    List<ComplianceDocument> findByTag(@Param("tag") String tag);
    
    List<ComplianceDocument> findBySourceSystemOrderByCreatedAtDesc(String sourceSystem);
    
    @Query("SELECT c FROM ComplianceDocument c WHERE " +
           "LOWER(c.filename) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(c.complianceType) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(c.jurisdiction) LIKE LOWER(CONCAT('%', ?1, '%')) " +
           "ORDER BY c.createdAt DESC")
    List<ComplianceDocument> search(String searchTerm);
    
    List<ComplianceDocument> findAllByOrderByCreatedAtDesc();
    
    @Query(value = "SELECT * FROM compliance_docs WHERE " +
           "LOWER(filename) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(compliance_type) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(jurisdiction) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY created_at DESC", nativeQuery = true)
    List<ComplianceDocument> searchOrderByCreatedAtDesc(@Param("searchTerm") String searchTerm);
} 