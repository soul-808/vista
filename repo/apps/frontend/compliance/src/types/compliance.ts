export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export enum ComplianceType {
  KYC_AND_AML = "KYC & AML",
  CAPITAL_REPORTING_AND_PAYMENT_RULES = "Capital Reporting & Payment Rules",
  AUDIT_REPORT_AND_UI_COMPLIANCE = "Audit Report & UI Compliance",
  REGULATORY_AND_SANCTIONS = "Regulatory & Sanctions",
  RISK_ASSESSMENT_AND_DATA_PRIVACY = "Risk Assessment & Data Privacy",
  INCIDENT_REPORT = "Incident Report",
  OTHER = "Other",
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ComplianceDocument {
  id: string;
  filename: string;
  uploadedBy: UserDto;
  riskScore: RiskLevel;
  complianceType: ComplianceType;
  sourceSystem: string;
  jurisdiction: string;
  tags: string[];
  flaggedClauses: string[];
  notes?: string;
  createdAt: string;
}
