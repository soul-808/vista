export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

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
  complianceType: string;
  sourceSystem: string;
  jurisdiction: string;
  tags: string[];
  flaggedClauses: string[];
  notes?: string;
  createdAt: string;
}
