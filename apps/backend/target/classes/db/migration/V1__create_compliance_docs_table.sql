-- Create the compliance_docs table
CREATE TABLE IF NOT EXISTS compliance_docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    uploaded_by_user_id BIGINT NOT NULL,
    risk_score VARCHAR(20) CHECK (risk_score IN ('LOW', 'MEDIUM', 'HIGH')),
    compliance_type VARCHAR(100), 
    source_system VARCHAR(100), 
    jurisdiction VARCHAR(100), 
    tags TEXT[], 
    flagged_clauses JSONB, 
    original_doc BYTEA, 
    backup_doc BYTEA, 
    notes TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_uploaded_by FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
);

-- Insert mock data
INSERT INTO compliance_docs (
    id, 
    filename, 
    uploaded_by_user_id, 
    risk_score, 
    compliance_type, 
    source_system, 
    jurisdiction, 
    tags, 
    flagged_clauses, 
    original_doc, 
    notes, 
    created_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000001'::uuid, 
    'Q1_2025_KYC_Assessment.pdf', 
    101, 
    'HIGH', 
    'KYC', 
    'Core Banking', 
    'US', 
    ARRAY['KYC', 'Quarterly', 'High-Risk'], 
    jsonb_build_array(
        'Missing required client identification procedures',
        'Incomplete source of funds verification',
        'Inadequate risk rating methodology'
    ), 
    decode('SGVsbG8gV29ybGQ=', 'base64'), 
    'Annual review of KYC assessment procedures', 
    '2025-04-10T14:32:00Z'::timestamp
),
(
    '00000000-0000-0000-0000-000000000002'::uuid, 
    'Capital_Adequacy_Report_Mar_2025.pdf', 
    102, 
    'LOW', 
    'Capital Reporting', 
    'Finance Systems', 
    'Global', 
    ARRAY['Basel III', 'Monthly', 'Capital'], 
    '[]'::jsonb, 
    decode('SGVsbG8gV29ybGQ=', 'base64'), 
    'Regular monthly capital adequacy report', 
    '2025-03-28T09:15:00Z'::timestamp
),
(
    '00000000-0000-0000-0000-000000000003'::uuid, 
    'AML_Policy_Review_2025.docx', 
    102, 
    'MEDIUM', 
    'AML', 
    'Compliance Portal', 
    'EU', 
    ARRAY['AML', 'Policy', 'Annual'], 
    jsonb_build_array(
        'Outdated transaction monitoring thresholds',
        'Insufficient PEP screening process'
    ), 
    decode('SGVsbG8gV29ybGQ=', 'base64'), 
    'Annual policy review document', 
    '2025-02-15T11:45:00Z'::timestamp
),
(
    '00000000-0000-0000-0000-000000000004'::uuid, 
    'Sanctions_Screening_Audit.pdf', 
    102, 
    'HIGH', 
    'Sanctions', 
    'Audit System', 
    'US', 
    ARRAY['Sanctions', 'Audit', 'High-Risk'], 
    jsonb_build_array(
        'Critical gaps in sanctions screening workflow',
        'Outdated sanctions lists',
        'Manual override without proper documentation'
    ), 
    decode('SGVsbG8gV29ybGQ=', 'base64'), 
    'External audit report on sanctions controls', 
    '2025-04-01T16:20:00Z'::timestamp
),
(
    '00000000-0000-0000-0000-000000000005'::uuid, 
    'Customer_Due_Diligence_Framework.pdf', 
    102, 
    'MEDIUM', 
    'KYC', 
    'Document Management', 
    'APAC', 
    ARRAY['KYC', 'Framework', 'CDD'], 
    jsonb_build_array(
        'Inconsistent application of enhanced due diligence'
    ), 
    decode('SGVsbG8gV29ybGQ=', 'base64'), 
    'Framework document for CDD processes', 
    '2025-03-05T10:30:00Z'::timestamp
),
(
    '00000000-0000-0000-0000-000000000006'::uuid, 
    'Transaction_Monitoring_Report_Q1.xlsx', 
    102, 
    'LOW', 
    'AML', 
    'AML System', 
    'Global', 
    ARRAY['AML', 'Quarterly', 'Monitoring'], 
    '[]'::jsonb, 
    decode('SGVsbG8gV29ybGQ=', 'base64'), 
    'Quarterly transaction monitoring statistics', 
    '2025-04-12T14:15:00Z'::timestamp
),
(
    '00000000-0000-0000-0000-000000000007'::uuid, 
    'Regulatory_Examination_Findings.pdf', 
    102, 
    'HIGH', 
    'Regulatory', 
    'Regulatory Affairs', 
    'US', 
    ARRAY['Regulatory', 'Examination', 'Critical'], 
    jsonb_build_array(
        'Failure to implement prior audit recommendations',
        'Inadequate board oversight of compliance program',
        'Insufficient compliance staffing and resources'
    ), 
    decode('SGVsbG8gV29ybGQ=', 'base64'), 
    'Results from regulatory examination', 
    '2025-03-25T09:45:00Z'::timestamp
); 