import React from "react";
import { ComplianceDocument } from "../../types/compliance";
import { FileText, Download } from "lucide-react";
import { RiskBadge } from "./RiskBadge";

interface DocumentTableProps {
  filteredDocuments: ComplianceDocument[];
  formatDate: (dateString: string) => string;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  filteredDocuments,
  formatDate,
}) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Document Repository
    </h2>
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 overflow-hidden">
      <div className="min-w-full divide-y divide-blue-200">
        <div className="bg-blue-100">
          <div className="grid grid-cols-12 px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
            <div className="col-span-3">Document Name</div>
            <div className="col-span-2">Compliance Type</div>
            <div className="col-span-2">Jurisdiction</div>
            <div className="col-span-1">Risk Level</div>
            <div className="col-span-2">Upload Date</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>
        <div className="bg-white divide-y divide-blue-100">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="grid grid-cols-12 px-6 py-4 text-sm text-gray-800 items-center hover:bg-blue-50 transition-colors"
              >
                <div className="col-span-3 font-medium flex items-center">
                  <FileText size={16} className="text-blue-500 mr-2" />
                  {doc.filename}
                </div>
                <div className="col-span-2">{doc.complianceType}</div>
                <div className="col-span-2">{doc.jurisdiction}</div>
                <div className="col-span-1">
                  <RiskBadge risk={doc.riskScore} />
                </div>
                <div className="col-span-2">{formatDate(doc.createdAt)}</div>
                <div className="col-span-2 flex space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
                    <Download size={16} />
                  </button>
                  <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-sm text-blue-500 text-center">
              No documents found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
