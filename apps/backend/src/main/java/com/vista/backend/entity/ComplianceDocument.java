package com.vista.backend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vista.backend.util.StringListArrayConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Convert;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "compliance_docs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceDocument {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String filename;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploaded_by_user_id", nullable = false)
    private User uploadedBy;

    @Column(name = "risk_score")
    private String riskScore;

    @Column(name = "compliance_type")
    private String complianceType;

    @Column(name = "source_system")
    private String sourceSystem;

    private String jurisdiction;

    @Convert(converter = StringListArrayConverter.class)
    @Column(columnDefinition = "text[]", name = "tags")
    private List<String> tags = new ArrayList<>();

    @Column(name = "flagged_clauses", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> flaggedClauses = new ArrayList<>();

    @Lob
    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "original_doc", columnDefinition = "bytea")
    @JsonIgnore
    private byte[] originalDoc;

    @Lob
    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "backup_doc", columnDefinition = "bytea")
    @JsonIgnore
    private byte[] backupDoc;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
} 