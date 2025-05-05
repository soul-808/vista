import React from "react";
import { ComplianceDocument } from "../../types/compliance";
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

export const RiskCharts: React.FC<RiskChartsProps> = ({
  filteredDocuments,
}) => {
  const riskDistribution = [
    {
      name: "High",
      value: filteredDocuments.filter((d) => d.risk_score === "HIGH").length,
      color: "#EF4444",
    },
    {
      name: "Medium",
      value: filteredDocuments.filter((d) => d.risk_score === "MEDIUM").length,
      color: "#F59E0B",
    },
    {
      name: "Low",
      value: filteredDocuments.filter((d) => d.risk_score === "LOW").length,
      color: "#10B981",
    },
  ];

  const complianceTypeData = Array.from(
    new Set(filteredDocuments.map((doc) => doc.compliance_type))
  ).map((type) => ({
    name: type,
    count: filteredDocuments.filter((doc) => doc.compliance_type === type)
      .length,
  }));

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
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {complianceTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#3B82F6",
                          "#8B5CF6",
                          "#EC4899",
                          "#F59E0B",
                          "#10B981",
                          "#6366F1",
                        ][index % 6]
                      }
                    />
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
