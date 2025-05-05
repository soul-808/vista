package com.vista.backend.util;

import com.vista.backend.entity.ComplianceType;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA Converter for ComplianceType enum.
 * Converts between ComplianceType enum values and database string values.
 */
@Converter(autoApply = true)
public class ComplianceTypeConverter implements AttributeConverter<ComplianceType, String> {

    @Override
    public String convertToDatabaseColumn(ComplianceType attribute) {
        return attribute != null ? attribute.getDisplayName() : null;
    }

    @Override
    public ComplianceType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        return ComplianceType.fromDisplayName(dbData);
    }
} 