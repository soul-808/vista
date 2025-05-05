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

    List<ComplianceDocument> findByRiskScore(String riskScore);
    
    List<ComplianceDocument> findByComplianceType(String complianceType);
    
    List<ComplianceDocument> findByJurisdiction(String jurisdiction);
    
    @Query(value = "SELECT * FROM compliance_docs WHERE :tag = ANY(tags)", nativeQuery = true)
    List<ComplianceDocument> findByTag(@Param("tag") String tag);
    
    List<ComplianceDocument> findBySourceSystem(String sourceSystem);
    
    @Query("SELECT c FROM ComplianceDocument c WHERE " +
           "LOWER(c.filename) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(c.complianceType) LIKE LOWER(CONCAT('%', ?1, '%')) OR " +
           "LOWER(c.jurisdiction) LIKE LOWER(CONCAT('%', ?1, '%'))")
    List<ComplianceDocument> search(String searchTerm);
} 