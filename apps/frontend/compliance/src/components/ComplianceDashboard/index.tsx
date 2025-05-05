import React, { useState, useMemo } from "react";
import {
  useComplianceDocuments,
  useUploadComplianceDocument,
} from "../../hooks/useComplianceDocuments";
import { StatsCards } from "./StatsCards";
import { RiskCharts } from "./RiskCharts";
import { DocumentTable } from "./DocumentTable";
import { UploadModal } from "./UploadModal";

const ComplianceDashboard: React.FC = () => {
  const { data: documents = [], isLoading } = useComplianceDocuments();
  const uploadMutation = useUploadComplianceDocument();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocType, setSelectedDocType] = useState("Risk Assessment");

  const filteredDocuments = useMemo(() => {
    let result = documents;
    if (filter !== "all") {
      result = result.filter((doc) => doc.riskScore === filter.toUpperCase());
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.filename.toLowerCase().includes(term) ||
          doc.complianceType.toLowerCase().includes(term) ||
          doc.jurisdiction.toLowerCase().includes(term) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }
    return result;
  }, [documents, filter, searchTerm]);

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(
        { file: selectedFile, docType: selectedDocType },
        {
          onSuccess: () => {
            setSelectedFile(null);
            setUploadModalOpen(false);
          },
        }
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-2 h-10 bg-red-600 mr-3"></div>
              <div>
                <h1 className="text-xl font-bold text-black">
                  Vista Compliance Dashboard
                </h1>
                <p className="text-sm text-black">
                  Document Analysis & Risk Monitoring
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="py-6">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-black"
                placeholder="Search documents, tags, or jurisdictions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              <select
                className="block w-full pl-3 pr-10 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-black"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
          </div>
          <StatsCards filteredDocuments={filteredDocuments} />
          <RiskCharts filteredDocuments={filteredDocuments} />

          <DocumentTable
            filteredDocuments={filteredDocuments}
            formatDate={formatDate}
          />
        </div>
      </main>
      <UploadModal
        open={uploadModalOpen}
        selectedFile={selectedFile}
        selectedDocType={selectedDocType}
        setSelectedDocType={setSelectedDocType}
        setSelectedFile={setSelectedFile}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default ComplianceDashboard;
