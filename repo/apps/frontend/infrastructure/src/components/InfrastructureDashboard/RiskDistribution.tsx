import React from "react";
import { Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RiskDataItem {
  name: string;
  value: number;
  color: string;
}

interface RiskDistributionProps {
  riskData: RiskDataItem[];
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({
  riskData,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Shield size={18} className="mr-2 text-blue-600" />
        Risk Distribution
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} services`, name]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-600">High Risk</span>
          </div>
          <span className="font-medium">
            {riskData && riskData.length > 0 ? riskData[0].value : 0} services
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-sm text-gray-600">Medium Risk</span>
          </div>
          <span className="font-medium">
            {riskData && riskData.length > 1 ? riskData[1].value : 0} services
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Low Risk</span>
          </div>
          <span className="font-medium">
            {riskData && riskData.length > 2 ? riskData[2].value : 0} services
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskDistribution;
