package com.vista.backend.entity;

/**
 * Enumeration for compliance types used in the application.
 */
public enum ComplianceType {
    KYC_AND_AML("KYC & AML"),
    CAPITAL_REPORTING_AND_PAYMENT_RULES("Capital Reporting & Payment Rules"),
    AUDIT_REPORT_AND_UI_COMPLIANCE("Audit Report & UI Compliance"),
    REGULATORY_AND_SANCTIONS("Regulatory & Sanctions"),
    RISK_ASSESSMENT_AND_DATA_PRIVACY("Risk Assessment & Data Privacy"),
    INCIDENT_REPORT("Incident Report"),
    OTHER("Other");

    private final String displayName;

    ComplianceType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Convert a display name to its corresponding enum value
     * @param displayName the display name to convert
     * @return the corresponding enum value or OTHER if not found
     */
    public static ComplianceType fromDisplayName(String displayName) {
        if (displayName == null) {
            return OTHER;
        }
        
        for (ComplianceType type : ComplianceType.values()) {
            if (type.getDisplayName().equalsIgnoreCase(displayName)) {
                return type;
            }
        }
        
        return OTHER;
    }
} 