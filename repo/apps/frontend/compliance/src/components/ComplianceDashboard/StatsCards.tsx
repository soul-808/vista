import React from "react";
import { ComplianceDocument } from "../../types/compliance";
import { FileText, AlertTriangle, Check, Clock } from "lucide-react";

interface StatsCardsProps {
  filteredDocuments: ComplianceDocument[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  filteredDocuments,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-blue-700">
                Total Documents
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {filteredDocuments.length}
              </p>
            </div>
            <div className="p-2 bg-white rounded-full shadow-sm">
              <FileText size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Last 30 days</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-red-700">High Risk</p>
              <p className="text-2xl font-bold text-red-900">
                {filteredDocuments.filter((d) => d.riskScore === "HIGH").length}
              </p>
            </div>
            <div className="p-2 bg-white rounded-full shadow-sm">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">Immediate attention</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-green-700">Compliant</p>
              <p className="text-2xl font-bold text-green-900">
                {
                  filteredDocuments.filter((d) => d.flaggedClauses.length === 0)
                    .length
                }
              </p>
            </div>
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Check size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">No issues detected</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-amber-700">
                Recent Uploads
              </p>
              <p className="text-2xl font-bold text-amber-900">
                {
                  filteredDocuments.filter((d) => {
                    const date = new Date(d.createdAt);
                    const now = new Date();
                    const diffTime = Math.abs(now.getTime() - date.getTime());
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 7;
                  }).length
                }
              </p>
            </div>
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Clock size={20} className="text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-2">Last 7 days</p>
        </div>
      </div>
    </div>
  );
};
