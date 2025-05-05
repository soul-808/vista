export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ComplianceDocument {
  id: string;
  filename: string;
  uploaded_by: string;
  risk_score: RiskLevel;
  compliance_type: string;
  source_system: string;
  jurisdiction: string;
  tags: string[];
  flagged_clauses: string[];
  created_at: string;
}
