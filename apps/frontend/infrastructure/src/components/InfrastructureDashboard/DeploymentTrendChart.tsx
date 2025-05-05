import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DeploymentDataItem {
  date: string;
  success: number;
  failure: number;
  rollback: number;
  total: number;
}

interface DeploymentTrendChartProps {
  deploymentData: DeploymentDataItem[];
}

export const DeploymentTrendChart: React.FC<DeploymentTrendChartProps> = ({
  deploymentData,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Deployment Trend
        </h2>
        <div className="flex text-xs space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Success</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>Failed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
            <span>Rollback</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={deploymentData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            barGap={0}
            barCategoryGap="15%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value, name) => [
                value,
                name === "success"
                  ? "Success"
                  : name === "failure"
                  ? "Failed"
                  : "Rollback",
              ]}
              labelFormatter={(value) => `Date: ${value}`}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="success"
              stackId="a"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="failure"
              stackId="a"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="rollback"
              stackId="a"
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeploymentTrendChart;
