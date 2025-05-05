// import axios from "axios";
import { ComplianceDocument } from "../types/compliance";

const mockDocuments: ComplianceDocument[] = [
  {
    id: "1",
    filename: "Q1_2025_KYC_Assessment.pdf",
    uploaded_by: "sarah.johnson@company.com",
    risk_score: "HIGH",
    compliance_type: "KYC",
    source_system: "Core Banking",
    jurisdiction: "US",
    tags: ["KYC", "Quarterly", "High-Risk"],
    flagged_clauses: [
      "Missing required client identification procedures",
      "Incomplete source of funds verification",
      "Inadequate risk rating methodology",
    ],
    created_at: "2025-04-10T14:32:00Z",
  },
  {
    id: "2",
    filename: "Capital_Adequacy_Report_Mar_2025.pdf",
    uploaded_by: "james.smith@company.com",
    risk_score: "LOW",
    compliance_type: "Capital Reporting",
    source_system: "Finance Systems",
    jurisdiction: "Global",
    tags: ["Basel III", "Monthly", "Capital"],
    flagged_clauses: [],
    created_at: "2025-03-28T09:15:00Z",
  },
  {
    id: "3",
    filename: "AML_Policy_Review_2025.docx",
    uploaded_by: "robert.chen@company.com",
    risk_score: "MEDIUM",
    compliance_type: "AML",
    source_system: "Compliance Portal",
    jurisdiction: "EU",
    tags: ["AML", "Policy", "Annual"],
    flagged_clauses: [
      "Outdated transaction monitoring thresholds",
      "Insufficient PEP screening process",
    ],
    created_at: "2025-02-15T11:45:00Z",
  },
  {
    id: "4",
    filename: "Sanctions_Screening_Audit.pdf",
    uploaded_by: "maria.rodriguez@company.com",
    risk_score: "HIGH",
    compliance_type: "Sanctions",
    source_system: "Audit System",
    jurisdiction: "US",
    tags: ["Sanctions", "Audit", "High-Risk"],
    flagged_clauses: [
      "Critical gaps in sanctions screening workflow",
      "Outdated sanctions lists",
      "Manual override without proper documentation",
    ],
    created_at: "2025-04-01T16:20:00Z",
  },
  {
    id: "5",
    filename: "Customer_Due_Diligence_Framework.pdf",
    uploaded_by: "david.wong@company.com",
    risk_score: "MEDIUM",
    compliance_type: "KYC",
    source_system: "Document Management",
    jurisdiction: "APAC",
    tags: ["KYC", "Framework", "CDD"],
    flagged_clauses: ["Inconsistent application of enhanced due diligence"],
    created_at: "2025-03-05T10:30:00Z",
  },
  {
    id: "6",
    filename: "Transaction_Monitoring_Report_Q1.xlsx",
    uploaded_by: "susan.miller@company.com",
    risk_score: "LOW",
    compliance_type: "AML",
    source_system: "AML System",
    jurisdiction: "Global",
    tags: ["AML", "Quarterly", "Monitoring"],
    flagged_clauses: [],
    created_at: "2025-04-12T14:15:00Z",
  },
  {
    id: "7",
    filename: "Regulatory_Examination_Findings.pdf",
    uploaded_by: "thomas.johnson@company.com",
    risk_score: "HIGH",
    compliance_type: "Regulatory",
    source_system: "Regulatory Affairs",
    jurisdiction: "US",
    tags: ["Regulatory", "Examination", "Critical"],
    flagged_clauses: [
      "Failure to implement prior audit recommendations",
      "Inadequate board oversight of compliance program",
      "Insufficient compliance staffing and resources",
    ],
    created_at: "2025-03-25T09:45:00Z",
  },
];

export const fetchComplianceDocuments = async (): Promise<
  ComplianceDocument[]
> => {
  // const { data } = await api.get<ComplianceDocument[]>("/compliance-documents");
  // return data;
  return mockDocuments;
};

export const uploadComplianceDocument = async (
  file: File,
  docType: string
): Promise<void> => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Uploaded document: ${file.name}, Type: ${docType}`);
      resolve();
    }, 1000);
  });
};

// export default api;
