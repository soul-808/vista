import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface CoverageDataItem {
  date: string;
  coverage: number;
}

interface CodeCoverageChartProps {
  coverageData: CoverageDataItem[];
}

export const CodeCoverageChart: React.FC<CodeCoverageChartProps> = ({
  coverageData,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Code Coverage Trend
        </h2>
        <div className="flex text-xs items-center">
          <div className="w-10 h-1 bg-gradient-to-r from-orange-400 to-blue-500 rounded mr-1"></div>
          <span>Coverage %</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={coverageData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis domain={[40, 100]} />
            <Tooltip
              formatter={(value) => [`${value}%`, "Coverage"]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="coverage"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            {/* Target line */}
            <ReferenceLine
              y={80}
              stroke="#9333EA"
              strokeDasharray="3 3"
              label={{
                value: "Target (80%)",
                position: "insideBottomRight",
                fill: "#9333EA",
                fontSize: 12,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CodeCoverageChart;
