-- Convert all VARCHAR columns in compliance_docs to TEXT to fix length issues
ALTER TABLE compliance_docs ALTER COLUMN filename TYPE TEXT;
ALTER TABLE compliance_docs ALTER COLUMN risk_score TYPE TEXT;
ALTER TABLE compliance_docs ALTER COLUMN compliance_type TYPE TEXT;
ALTER TABLE compliance_docs ALTER COLUMN source_system TYPE TEXT;
ALTER TABLE compliance_docs ALTER COLUMN jurisdiction TYPE TEXT; 