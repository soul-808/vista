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
  const [uploadError, setUploadError] = useState<string | null>(null);

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
          (doc.uploadedBy?.name &&
            doc.uploadedBy.name.toLowerCase().includes(term)) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }
    return result;
  }, [documents, filter, searchTerm]);

  const handleUpload = () => {
    if (selectedFile) {
      setUploadError(null); // Clear any previous errors
      uploadMutation.mutate(
        {
          file: selectedFile,
          docType: selectedDocType,
        },
        {
          onSuccess: () => {
            setSelectedFile(null);
            setUploadModalOpen(false);
          },
          onError: (error) => {
            console.error("Upload failed:", error);
            const errorMessage =
              error instanceof Error
                ? error.message
                : "The document upload failed. It may contain content that is too long or in an unsupported format.";
            setUploadError(errorMessage);
          },
        }
      );
    }
  };

  // Reset error when modal is closed
  const handleCloseModal = () => {
    setUploadError(null);
    setUploadModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Compliance Documents
            </h1>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload Document
            </button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <main className="py-6">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-black"
                    placeholder="Search documents, tags, jurisdictions, or uploaders..."
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
        </>
      )}

      <UploadModal
        open={uploadModalOpen}
        selectedFile={selectedFile}
        selectedDocType={selectedDocType}
        setSelectedDocType={setSelectedDocType}
        setSelectedFile={setSelectedFile}
        onClose={handleCloseModal}
        onUpload={handleUpload}
        isUploading={uploadMutation.isPending}
        error={uploadError}
      />
    </div>
  );
};

export default ComplianceDashboard;
