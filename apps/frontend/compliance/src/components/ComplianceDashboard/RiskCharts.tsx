import React from "react";
import { ComplianceDocument, ComplianceType } from "../../types/compliance";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface RiskChartsProps {
  filteredDocuments: ComplianceDocument[];
}

// Map of compliance types to colors
const COMPLIANCE_TYPE_COLORS: Record<string, string> = {
  [ComplianceType.KYC_AND_AML]: "#3B82F6",
  [ComplianceType.CAPITAL_REPORTING_AND_PAYMENT_RULES]: "#8B5CF6",
  [ComplianceType.AUDIT_REPORT_AND_UI_COMPLIANCE]: "#EC4899",
  [ComplianceType.REGULATORY_AND_SANCTIONS]: "#F59E0B",
  [ComplianceType.RISK_ASSESSMENT_AND_DATA_PRIVACY]: "#10B981",
  [ComplianceType.INCIDENT_REPORT]: "#6366F1",
  [ComplianceType.OTHER]: "#9CA3AF",
};

export const RiskCharts: React.FC<RiskChartsProps> = ({
  filteredDocuments,
}) => {
  const riskDistribution = [
    {
      name: "High",
      value: filteredDocuments.filter((d) => d.riskScore === "HIGH").length,
      color: "#EF4444",
    },
    {
      name: "Medium",
      value: filteredDocuments.filter((d) => d.riskScore === "MEDIUM").length,
      color: "#F59E0B",
    },
    {
      name: "Low",
      value: filteredDocuments.filter((d) => d.riskScore === "LOW").length,
      color: "#10B981",
    },
  ];

  // Create data for compliance type distribution using the enum values
  const complianceTypeData = Object.values(ComplianceType)
    .map((type) => ({
      name: type,
      count: filteredDocuments.filter((doc) => doc.complianceType === type)
        .length,
      color: COMPLIANCE_TYPE_COLORS[type] || "#9CA3AF",
    }))
    .filter((item) => item.count > 0); // Only show types that have documents

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Risk Analysis
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Risk Distribution
          </h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-100">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} documents`, "Count"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Compliance Types
          </h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-100">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#3B82F6"
                  dataKey="count"
                  nameKey="name"
                >
                  {complianceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} documents`, "Count"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
