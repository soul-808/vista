-- Alter compliance_docs table to increase varchar field sizes
ALTER TABLE compliance_docs ALTER COLUMN filename TYPE VARCHAR(500);
ALTER TABLE compliance_docs ALTER COLUMN risk_score TYPE VARCHAR(50);
ALTER TABLE compliance_docs ALTER COLUMN compliance_type TYPE VARCHAR(100);
ALTER TABLE compliance_docs ALTER COLUMN source_system TYPE VARCHAR(100);
ALTER TABLE compliance_docs ALTER COLUMN jurisdiction TYPE VARCHAR(100); 