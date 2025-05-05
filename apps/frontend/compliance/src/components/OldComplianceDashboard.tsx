// import React, { useState, useEffect, ChangeEvent } from "react";
// import {
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   FileText,
//   Upload,
//   AlertTriangle,
//   Check,
//   Clock,
//   Filter,
//   Search,
//   Download,
// } from "lucide-react";

// // Document interface
// interface ComplianceDocument {
//   id: string;
//   filename: string;
//   uploaded_by: string;
//   risk_score: "HIGH" | "MEDIUM" | "LOW";
//   compliance_type: string;
//   source_system: string;
//   jurisdiction: string;
//   tags: string[];
//   flagged_clauses: string[];
//   created_at: string;
// }

// type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

// const ComplianceDashboard: React.FC = () => {
//   // State for documents and metrics
//   const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
//   const [filteredDocuments, setFilteredDocuments] = useState<
//     ComplianceDocument[]
//   >([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [filter, setFilter] = useState<string>("all");
//   const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedDocType, setSelectedDocType] =
//     useState<string>("Risk Assessment");
//   const [loading, setLoading] = useState<boolean>(true);

//   // Mock data - in a real app this would come from your API
//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       const mockDocuments = [
//         {
//           id: "1",
//           filename: "Q1_2025_KYC_Assessment.pdf",
//           uploaded_by: "sarah.johnson@company.com",
//           risk_score: "HIGH" as RiskLevel,
//           compliance_type: "KYC",
//           source_system: "Core Banking",
//           jurisdiction: "US",
//           tags: ["KYC", "Quarterly", "High-Risk"],
//           flagged_clauses: [
//             "Missing required client identification procedures",
//             "Incomplete source of funds verification",
//             "Inadequate risk rating methodology",
//           ],
//           created_at: "2025-04-10T14:32:00Z",
//         },
//         {
//           id: "2",
//           filename: "Capital_Adequacy_Report_Mar_2025.pdf",
//           uploaded_by: "james.smith@company.com",
//           risk_score: "LOW" as RiskLevel,
//           compliance_type: "Capital Reporting",
//           source_system: "Finance Systems",
//           jurisdiction: "Global",
//           tags: ["Basel III", "Monthly", "Capital"],
//           flagged_clauses: [],
//           created_at: "2025-03-28T09:15:00Z",
//         },
//         {
//           id: "3",
//           filename: "AML_Policy_Review_2025.docx",
//           uploaded_by: "robert.chen@company.com",
//           risk_score: "MEDIUM" as RiskLevel,
//           compliance_type: "AML",
//           source_system: "Compliance Portal",
//           jurisdiction: "EU",
//           tags: ["AML", "Policy", "Annual"],
//           flagged_clauses: [
//             "Outdated transaction monitoring thresholds",
//             "Insufficient PEP screening process",
//           ],
//           created_at: "2025-02-15T11:45:00Z",
//         },
//         {
//           id: "4",
//           filename: "Sanctions_Screening_Audit.pdf",
//           uploaded_by: "maria.rodriguez@company.com",
//           risk_score: "HIGH" as RiskLevel,
//           compliance_type: "Sanctions",
//           source_system: "Audit System",
//           jurisdiction: "US",
//           tags: ["Sanctions", "Audit", "High-Risk"],
//           flagged_clauses: [
//             "Critical gaps in sanctions screening workflow",
//             "Outdated sanctions lists",
//             "Manual override without proper documentation",
//           ],
//           created_at: "2025-04-01T16:20:00Z",
//         },
//         {
//           id: "5",
//           filename: "Customer_Due_Diligence_Framework.pdf",
//           uploaded_by: "david.wong@company.com",
//           risk_score: "MEDIUM" as RiskLevel,
//           compliance_type: "KYC",
//           source_system: "Document Management",
//           jurisdiction: "APAC",
//           tags: ["KYC", "Framework", "CDD"],
//           flagged_clauses: [
//             "Inconsistent application of enhanced due diligence",
//           ],
//           created_at: "2025-03-05T10:30:00Z",
//         },
//         {
//           id: "6",
//           filename: "Transaction_Monitoring_Report_Q1.xlsx",
//           uploaded_by: "susan.miller@company.com",
//           risk_score: "LOW" as RiskLevel,
//           compliance_type: "AML",
//           source_system: "AML System",
//           jurisdiction: "Global",
//           tags: ["AML", "Quarterly", "Monitoring"],
//           flagged_clauses: [],
//           created_at: "2025-04-12T14:15:00Z",
//         },
//         {
//           id: "7",
//           filename: "Regulatory_Examination_Findings.pdf",
//           uploaded_by: "thomas.johnson@company.com",
//           risk_score: "HIGH" as RiskLevel,
//           compliance_type: "Regulatory",
//           source_system: "Regulatory Affairs",
//           jurisdiction: "US",
//           tags: ["Regulatory", "Examination", "Critical"],
//           flagged_clauses: [
//             "Failure to implement prior audit recommendations",
//             "Inadequate board oversight of compliance program",
//             "Insufficient compliance staffing and resources",
//           ],
//           created_at: "2025-03-25T09:45:00Z",
//         },
//       ];

//       setDocuments(mockDocuments);
//       setFilteredDocuments(mockDocuments);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   // Handle search and filtering
//   useEffect(() => {
//     let result = documents;

//     // Apply risk filter
//     if (filter !== "all") {
//       result = result.filter((doc) => doc.risk_score === filter.toUpperCase());
//     }

//     // Apply search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(
//         (doc) =>
//           doc.filename.toLowerCase().includes(term) ||
//           doc.compliance_type.toLowerCase().includes(term) ||
//           doc.jurisdiction.toLowerCase().includes(term) ||
//           doc.tags.some((tag) => tag.toLowerCase().includes(term))
//       );
//     }

//     setFilteredDocuments(result);
//   }, [documents, filter, searchTerm]);

//   // Risk distribution for pie chart
//   const riskDistribution = [
//     {
//       name: "High",
//       value: filteredDocuments.filter((d) => d.risk_score === "HIGH").length,
//       color: "#EF4444",
//     },
//     {
//       name: "Medium",
//       value: filteredDocuments.filter((d) => d.risk_score === "MEDIUM").length,
//       color: "#F59E0B",
//     },
//     {
//       name: "Low",
//       value: filteredDocuments.filter((d) => d.risk_score === "LOW").length,
//       color: "#10B981",
//     },
//   ];

//   // Compliance type distribution for bar chart
//   const complianceTypeData = Array.from(
//     new Set(filteredDocuments.map((doc) => doc.compliance_type))
//   ).map((type) => ({
//     name: type,
//     count: filteredDocuments.filter((doc) => doc.compliance_type === type)
//       .length,
//   }));

//   // Handle file selection
//   const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   // Handle upload
//   const handleUpload = () => {
//     if (!selectedFile) return;

//     // In a real app, you would upload to your backend here
//     const riskRand = Math.random();
//     let risk_score: RiskLevel = "LOW";
//     if (riskRand > 0.7) risk_score = "HIGH";
//     else if (riskRand > 0.4) risk_score = "MEDIUM";
//     const newDoc: ComplianceDocument = {
//       id: (documents.length + 1).toString(),
//       filename: selectedFile.name,
//       uploaded_by: "current.user@company.com",
//       risk_score,
//       compliance_type: selectedDocType,
//       source_system: "Upload Portal",
//       jurisdiction: "US",
//       tags: [selectedDocType, "Upload"],
//       flagged_clauses: Math.random() > 0.6 ? ["AI analysis pending"] : [],
//       created_at: new Date().toISOString(),
//     };

//     setDocuments([newDoc, ...documents]);
//     setSelectedFile(null);
//     setUploadModalOpen(false);
//   };

//   // Render risk badge with appropriate color and improved styling
//   const RiskBadge: React.FC<{ risk: RiskLevel }> = ({ risk }) => {
//     const colorMap: Record<RiskLevel, string> = {
//       HIGH: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 shadow-red-100",
//       MEDIUM:
//         "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 shadow-amber-100",
//       LOW: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 shadow-green-100",
//     };
//     return (
//       <span
//         className={`px-3 py-1 text-xs font-medium rounded-full border shadow-sm ${colorMap[risk]}`}
//       >
//         {risk}
//       </span>
//     );
//   };

//   // Format date to be more readable
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     }).format(date);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-blue-100">
//         <div className="w-full px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <div className="w-2 h-10 bg-red-600 mr-3"></div>
//               <div>
//                 <h1 className="text-xl font-bold text-blue-900">
//                   Vista Compliance Dashboard
//                 </h1>
//                 <p className="text-sm text-blue-600">
//                   Document Analysis & Risk Monitoring
//                 </p>
//               </div>
//             </div>
//             <div>
//               <button
//                 onClick={() => setUploadModalOpen(true)}
//                 className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//               >
//                 <Upload size={16} className="mr-2" />
//                 Upload Document
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="py-6">
//         <div className="w-full px-4 sm:px-6 lg:px-8">
//           {/* Section 1: Stats Cards */}
//           <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Overview
//             </h2>
//             <div className="grid grid-cols-4 gap-4">
//               <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-medium text-blue-700">
//                       Total Documents
//                     </p>
//                     <p className="text-2xl font-bold text-blue-900">
//                       {filteredDocuments.length}
//                     </p>
//                   </div>
//                   <div className="p-2 bg-white rounded-full shadow-sm">
//                     <FileText size={20} className="text-blue-600" />
//                   </div>
//                 </div>
//                 <p className="text-xs text-blue-600 mt-2">Last 30 days</p>
//               </div>

//               <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-medium text-red-700">
//                       High Risk
//                     </p>
//                     <p className="text-2xl font-bold text-red-900">
//                       {
//                         filteredDocuments.filter((d) => d.risk_score === "HIGH")
//                           .length
//                       }
//                     </p>
//                   </div>
//                   <div className="p-2 bg-white rounded-full shadow-sm">
//                     <AlertTriangle size={20} className="text-red-600" />
//                   </div>
//                 </div>
//                 <p className="text-xs text-red-600 mt-2">Immediate attention</p>
//               </div>

//               <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-medium text-green-700">
//                       Compliant
//                     </p>
//                     <p className="text-2xl font-bold text-green-900">
//                       {
//                         filteredDocuments.filter(
//                           (d) => d.flagged_clauses.length === 0
//                         ).length
//                       }
//                     </p>
//                   </div>
//                   <div className="p-2 bg-white rounded-full shadow-sm">
//                     <Check size={20} className="text-green-600" />
//                   </div>
//                 </div>
//                 <p className="text-xs text-green-600 mt-2">
//                   No issues detected
//                 </p>
//               </div>

//               <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm font-medium text-amber-700">
//                       Recent Uploads
//                     </p>
//                     <p className="text-2xl font-bold text-amber-900">
//                       {
//                         filteredDocuments.filter((d) => {
//                           const date = new Date(d.created_at);
//                           const now = new Date();
//                           const diffTime = Math.abs(
//                             now.getTime() - date.getTime()
//                           );
//                           const diffDays = Math.ceil(
//                             diffTime / (1000 * 60 * 60 * 24)
//                           );
//                           return diffDays <= 7;
//                         }).length
//                       }
//                     </p>
//                   </div>
//                   <div className="p-2 bg-white rounded-full shadow-sm">
//                     <Clock size={20} className="text-amber-600" />
//                   </div>
//                 </div>
//                 <p className="text-xs text-amber-600 mt-2">Last 7 days</p>
//               </div>
//             </div>
//           </div>

//           {/* Section 2: Charts */}
//           <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Risk Analysis
//             </h2>
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">
//                   Risk Distribution
//                 </h3>
//                 <div className="h-64 bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-100">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={riskDistribution}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) =>
//                           `${name}: ${(percent * 100).toFixed(0)}%`
//                         }
//                       >
//                         {riskDistribution.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip
//                         formatter={(value) => [`${value} documents`, "Count"]}
//                       />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">
//                   Compliance Types
//                 </h3>
//                 <div className="h-64 bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-blue-100">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={complianceTypeData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#3B82F6"
//                         dataKey="count"
//                         nameKey="name"
//                         label={({ name, percent }) =>
//                           `${name}: ${(percent * 100).toFixed(0)}%`
//                         }
//                       >
//                         {complianceTypeData.map((_, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={
//                               [
//                                 "#3B82F6",
//                                 "#8B5CF6",
//                                 "#EC4899",
//                                 "#F59E0B",
//                                 "#10B981",
//                                 "#6366F1",
//                               ][index % 6]
//                             }
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip
//                         formatter={(value) => [`${value} documents`, "Count"]}
//                       />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section 3: Search and Documents */}
//           <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//               <div className="relative flex-grow">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search size={16} className="text-blue-400" />
//                 </div>
//                 <input
//                   type="text"
//                   className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
//                   placeholder="Search documents, tags, or jurisdictions..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <div className="flex-shrink-0 flex items-center gap-2">
//                 <Filter size={16} className="text-blue-400" />
//                 <select
//                   className="block w-full pl-3 pr-10 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-blue-50"
//                   value={filter}
//                   onChange={(e) => setFilter(e.target.value)}
//                 >
//                   <option value="all">All Risk Levels</option>
//                   <option value="high">High Risk</option>
//                   <option value="medium">Medium Risk</option>
//                   <option value="low">Low Risk</option>
//                 </select>
//               </div>
//             </div>

//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Document Repository
//             </h2>
//             <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 overflow-hidden">
//               <div className="min-w-full divide-y divide-blue-200">
//                 <div className="bg-blue-100">
//                   <div className="grid grid-cols-12 px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
//                     <div className="col-span-3">Document Name</div>
//                     <div className="col-span-2">Compliance Type</div>
//                     <div className="col-span-2">Jurisdiction</div>
//                     <div className="col-span-1">Risk Level</div>
//                     <div className="col-span-2">Upload Date</div>
//                     <div className="col-span-2">Actions</div>
//                   </div>
//                 </div>
//                 <div className="bg-white divide-y divide-blue-100">
//                   {filteredDocuments.length > 0 ? (
//                     filteredDocuments.map((doc) => (
//                       <div
//                         key={doc.id}
//                         className="grid grid-cols-12 px-6 py-4 text-sm text-gray-800 items-center hover:bg-blue-50 transition-colors"
//                       >
//                         <div className="col-span-3 font-medium flex items-center">
//                           <FileText size={16} className="text-blue-500 mr-2" />
//                           {doc.filename}
//                         </div>
//                         <div className="col-span-2">{doc.compliance_type}</div>
//                         <div className="col-span-2">{doc.jurisdiction}</div>
//                         <div className="col-span-1">
//                           <RiskBadge risk={doc.risk_score} />
//                         </div>
//                         <div className="col-span-2">
//                           {formatDate(doc.created_at)}
//                         </div>
//                         <div className="col-span-2 flex space-x-2">
//                           <button className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
//                             <Download size={16} />
//                           </button>
//                           <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
//                             View Details
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-6 py-8 text-sm text-blue-500 text-center">
//                       No documents found matching your criteria.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Upload Modal */}
//       {uploadModalOpen && (
//         <div className="fixed inset-0 overflow-y-auto z-50">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div
//               className="fixed inset-0 transition-opacity"
//               aria-hidden="true"
//             >
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
//             <span
//               className="hidden sm:inline-block sm:align-middle sm:h-screen"
//               aria-hidden="true"
//             >
//               &#8203;
//             </span>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//                       Upload Compliance Document
//                     </h3>
//                     <div className="mt-2 space-y-4">
//                       <div>
//                         <label
//                           htmlFor="docType"
//                           className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                           Document Type
//                         </label>
//                         <select
//                           id="docType"
//                           className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                           value={selectedDocType}
//                           onChange={(e) => setSelectedDocType(e.target.value)}
//                         >
//                           <option value="Risk Assessment">
//                             Risk Assessment
//                           </option>
//                           <option value="KYC">KYC Document</option>
//                           <option value="AML">AML Policy</option>
//                           <option value="Capital Reporting">
//                             Capital Reporting
//                           </option>
//                           <option value="Regulatory">
//                             Regulatory Document
//                           </option>
//                           <option value="Sanctions">Sanctions Screening</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Upload File
//                         </label>
//                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                           <div className="space-y-1 text-center">
//                             <svg
//                               className="mx-auto h-12 w-12 text-gray-400"
//                               stroke="currentColor"
//                               fill="none"
//                               viewBox="0 0 48 48"
//                               aria-hidden="true"
//                             >
//                               <path
//                                 d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                                 strokeWidth={2}
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                               />
//                             </svg>
//                             <div className="flex text-sm text-gray-600">
//                               <label
//                                 htmlFor="file-upload"
//                                 className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
//                               >
//                                 <span>Upload a file</span>
//                                 <input
//                                   id="file-upload"
//                                   name="file-upload"
//                                   type="file"
//                                   className="sr-only"
//                                   onChange={handleFileSelect}
//                                   accept=".pdf,.docx,.xlsx,.txt"
//                                 />
//                               </label>
//                               <p className="pl-1">or drag and drop</p>
//                             </div>
//                             <p className="text-xs text-gray-500">
//                               PDF, DOCX, XLSX up to 10MB
//                             </p>
//                           </div>
//                         </div>
//                         {selectedFile && (
//                           <p className="mt-2 text-sm text-gray-600">
//                             Selected: {selectedFile.name}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={handleUpload}
//                   disabled={!selectedFile}
//                 >
//                   Upload
//                 </button>
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={() => setUploadModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ComplianceDashboard;
