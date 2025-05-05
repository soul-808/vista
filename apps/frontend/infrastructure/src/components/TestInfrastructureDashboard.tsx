// import React, { useState, useEffect } from "react";
// import {
//   Server,
//   Shield,
//   AlertTriangle,
//   Check,
//   Clock,
//   Activity,
//   Code,
//   GitBranch,
//   ChevronDown,
//   TrendingDown,
//   TrendingUp,
//   Filter,
//   Calendar,
//   Search,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   ReferenceLine,
// } from "recharts";

// const InfrastructureDashboard = () => {
//   // Sample data for visualizations
//   const [deploymentData, setDeploymentData] = useState([]);
//   const [coverageData, setCoverageData] = useState([]);
//   const [riskData, setRiskData] = useState([]);
//   const [serviceData, setServiceData] = useState([]);
//   const [recentDeployments, setRecentDeployments] = useState([]);
//   const [timeRange, setTimeRange] = useState("7d");
//   const [activeServiceFilter, setActiveServiceFilter] = useState("all");

//   // Mock data loading
//   useEffect(() => {
//     // Generate sample data based on time range
//     generateMockData(timeRange);
//   }, [timeRange]);

//   const generateMockData = (range) => {
//     const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;

//     // Generate deployment data
//     const deployData = [];
//     let successCount = 0;
//     let failureCount = 0;
//     let rollbackCount = 0;

//     for (let i = 0; i < days; i++) {
//       const date = new Date();
//       date.setDate(date.getDate() - (days - i - 1));
//       const dateStr = date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       });

//       // Random daily deployments between 1-5
//       const dailyDeployments = Math.floor(Math.random() * 5) + 1;
//       const success = Math.floor(Math.random() * dailyDeployments);
//       const failure = Math.floor(Math.random() * (dailyDeployments - success));
//       const rollback = dailyDeployments - success - failure;

//       successCount += success;
//       failureCount += failure;
//       rollbackCount += rollback;

//       deployData.push({
//         date: dateStr,
//         success,
//         failure,
//         rollback,
//         total: dailyDeployments,
//       });
//     }

//     setDeploymentData(deployData);

//     // Generate coverage data
//     const coverage = [];
//     const today = new Date();

//     for (let i = 0; i < days; i++) {
//       const date = new Date();
//       date.setDate(today.getDate() - (days - i - 1));
//       const dateStr = date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       });

//       // Random coverage trending upward slightly
//       const baseValue = 68 + (i / days) * 10;
//       const randomVariation = Math.random() * 8 - 4; // Random variation between -4 and 4
//       const coverageValue = Math.min(
//         95,
//         Math.max(60, baseValue + randomVariation)
//       );

//       coverage.push({
//         date: dateStr,
//         coverage: parseFloat(coverageValue.toFixed(1)),
//       });
//     }

//     setCoverageData(coverage);

//     // Generate risk data
//     const risk = [
//       { name: "High", value: 3, color: "#EF4444" },
//       { name: "Medium", value: 7, color: "#F59E0B" },
//       { name: "Low", value: 12, color: "#10B981" },
//     ];

//     setRiskData(risk);

//     // Generate service data
//     const services = [
//       {
//         name: "Auth Service",
//         coverage: 87.2,
//         risk: "LOW",
//         deployments: 5,
//         failures: 0,
//       },
//       {
//         name: "Payment Gateway",
//         coverage: 92.5,
//         risk: "LOW",
//         deployments: 3,
//         failures: 0,
//       },
//       {
//         name: "User Management",
//         coverage: 78.4,
//         risk: "MEDIUM",
//         deployments: 6,
//         failures: 1,
//       },
//       {
//         name: "Notification Service",
//         coverage: 65.2,
//         risk: "HIGH",
//         deployments: 2,
//         failures: 1,
//       },
//       {
//         name: "Order Processing",
//         coverage: 83.9,
//         risk: "LOW",
//         deployments: 4,
//         failures: 0,
//       },
//       {
//         name: "Reporting API",
//         coverage: 72.6,
//         risk: "MEDIUM",
//         deployments: 7,
//         failures: 2,
//       },
//       {
//         name: "Admin Dashboard",
//         coverage: 56.8,
//         risk: "HIGH",
//         deployments: 3,
//         failures: 1,
//       },
//       {
//         name: "Customer Portal",
//         coverage: 88.5,
//         risk: "LOW",
//         deployments: 4,
//         failures: 0,
//       },
//     ];

//     setServiceData(services);

//     // Generate recent deployments
//     const recentDeploys = [
//       {
//         id: "cd48e22a",
//         service_name: "Payment Gateway",
//         commit_hash: "a5f7c91",
//         author: "Sarah Chen",
//         status: "SUCCESS",
//         coverage: 92.5,
//         risk_level: "LOW",
//         timestamp: "10 minutes ago",
//         changes: "+124 -56",
//       },
//       {
//         id: "bf31e90c",
//         service_name: "Notification Service",
//         commit_hash: "e2d8f45",
//         author: "Mike Johnson",
//         status: "FAIL",
//         coverage: 65.2,
//         risk_level: "HIGH",
//         timestamp: "2 hours ago",
//         changes: "+87 -32",
//       },
//       {
//         id: "a97c3d21",
//         service_name: "User Management",
//         commit_hash: "f9b3a12",
//         author: "David Lee",
//         status: "SUCCESS",
//         coverage: 78.4,
//         risk_level: "MEDIUM",
//         timestamp: "4 hours ago",
//         changes: "+215 -189",
//       },
//       {
//         id: "56e2f901",
//         service_name: "Admin Dashboard",
//         commit_hash: "c4d2e67",
//         author: "Emma Wilson",
//         status: "ROLLBACK",
//         coverage: 56.8,
//         risk_level: "HIGH",
//         timestamp: "6 hours ago",
//         changes: "+56 -12",
//       },
//       {
//         id: "32d9a74e",
//         service_name: "Auth Service",
//         commit_hash: "b3a17d9",
//         author: "James Taylor",
//         status: "SUCCESS",
//         coverage: 87.2,
//         risk_level: "LOW",
//         timestamp: "8 hours ago",
//         changes: "+43 -19",
//       },
//     ];

//     setRecentDeployments(recentDeploys);
//   };

//   // Status badge component with appropriate colors
//   const StatusBadge = ({ status }) => {
//     const colorMap = {
//       SUCCESS: "bg-green-100 text-green-800 border-green-200",
//       FAIL: "bg-red-100 text-red-800 border-red-200",
//       ROLLBACK: "bg-amber-100 text-amber-800 border-amber-200",
//       HIGH: "bg-red-100 text-red-800 border-red-200",
//       MEDIUM: "bg-amber-100 text-amber-800 border-amber-200",
//       LOW: "bg-green-100 text-green-800 border-green-200",
//     };

//     return (
//       <span
//         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[status]}`}
//       >
//         {status === "SUCCESS" && <Check size={14} className="mr-1" />}
//         {status === "FAIL" && <AlertTriangle size={14} className="mr-1" />}
//         {status === "ROLLBACK" && <TrendingDown size={14} className="mr-1" />}
//         {status === "HIGH" && <AlertTriangle size={14} className="mr-1" />}
//         {status === "MEDIUM" && <AlertTriangle size={14} className="mr-1" />}
//         {status === "LOW" && <Check size={14} className="mr-1" />}
//         {status}
//       </span>
//     );
//   };

//   // Filter services based on active filter
//   const filteredServices =
//     activeServiceFilter === "all"
//       ? serviceData
//       : serviceData.filter((service) => service.risk === activeServiceFilter);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-blue-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <div className="w-2 h-10 bg-red-600 mr-3"></div>
//               <div>
//                 <h1 className="text-xl font-bold text-blue-900">
//                   Vista Infrastructure Dashboard
//                 </h1>
//                 <p className="text-sm text-blue-600">
//                   Deployment Health & Code Quality Metrics
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center space-x-2">
//                 <Calendar size={16} className="text-gray-500" />
//                 <select
//                   className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-1.5"
//                   value={timeRange}
//                   onChange={(e) => setTimeRange(e.target.value)}
//                 >
//                   <option value="7d">Last 7 days</option>
//                   <option value="30d">Last 30 days</option>
//                   <option value="90d">Last 90 days</option>
//                 </select>
//               </div>
//               <div className="relative">
//                 <button className="flex items-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-1.5">
//                   <img
//                     className="h-6 w-6 rounded-full mr-2"
//                     src="/api/placeholder/24/24"
//                     alt="Profile"
//                   />
//                   <span>John Doe</span>
//                   <ChevronDown size={16} className="ml-1" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="py-6">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Top Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Total Deployments
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {deploymentData.reduce((sum, item) => sum + item.total, 0)}
//                   </p>
//                 </div>
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Activity size={20} className="text-blue-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex justify-between text-xs text-gray-500">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
//                   <span>
//                     Success:{" "}
//                     {deploymentData.reduce(
//                       (sum, item) => sum + item.success,
//                       0
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
//                   <span>
//                     Failed:{" "}
//                     {deploymentData.reduce(
//                       (sum, item) => sum + item.failure,
//                       0
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
//                   <span>
//                     Rollback:{" "}
//                     {deploymentData.reduce(
//                       (sum, item) => sum + item.rollback,
//                       0
//                     )}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Avg. Code Coverage
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {coverageData.length > 0
//                       ? `${(
//                           coverageData.reduce(
//                             (sum, item) => sum + item.coverage,
//                             0
//                           ) / coverageData.length
//                         ).toFixed(1)}%`
//                       : "0%"}
//                   </p>
//                 </div>
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Code size={20} className="text-blue-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex justify-between text-xs text-gray-500">
//                 <div className="flex items-center">
//                   <TrendingUp size={14} className="text-green-500 mr-1" />
//                   <span>+2.3% from last period</span>
//                 </div>
//                 <span className="text-blue-600 font-medium">Target: 80%</span>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Services at Risk
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {serviceData.filter((s) => s.risk === "HIGH").length}
//                   </p>
//                 </div>
//                 <div className="p-2 bg-red-100 rounded-lg">
//                   <AlertTriangle size={20} className="text-red-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex justify-between text-xs text-gray-500">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
//                   <span>
//                     High: {serviceData.filter((s) => s.risk === "HIGH").length}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
//                   <span>
//                     Medium:{" "}
//                     {serviceData.filter((s) => s.risk === "MEDIUM").length}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
//                   <span>
//                     Low: {serviceData.filter((s) => s.risk === "LOW").length}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     Auth Errors
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {Math.floor(Math.random() * 5)}
//                   </p>
//                 </div>
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Shield size={20} className="text-blue-600" />
//                 </div>
//               </div>
//               <div className="mt-4 flex justify-between text-xs text-gray-500">
//                 <div className="flex items-center">
//                   <TrendingDown size={14} className="text-green-500 mr-1" />
//                   <span>-35% from last period</span>
//                 </div>
//                 <span className="text-blue-600 font-medium">
//                   Last: 2 hrs ago
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Charts Row */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//             {/* Deployment Trend Chart */}
//             <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   Deployment Trend
//                 </h2>
//                 <div className="flex text-xs space-x-2">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
//                     <span>Success</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
//                     <span>Failed</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
//                     <span>Rollback</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={deploymentData}
//                     margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
//                     barGap={0}
//                     barCategoryGap="15%"
//                   >
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                     <XAxis dataKey="date" />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip
//                       formatter={(value, name) => [
//                         value,
//                         name === "success"
//                           ? "Success"
//                           : name === "failure"
//                           ? "Failed"
//                           : "Rollback",
//                       ]}
//                       labelFormatter={(value) => `Date: ${value}`}
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: "none",
//                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                       }}
//                     />
//                     <Bar
//                       dataKey="success"
//                       stackId="a"
//                       fill="#10B981"
//                       radius={[4, 4, 0, 0]}
//                     />
//                     <Bar
//                       dataKey="failure"
//                       stackId="a"
//                       fill="#EF4444"
//                       radius={[4, 4, 0, 0]}
//                     />
//                     <Bar
//                       dataKey="rollback"
//                       stackId="a"
//                       fill="#F59E0B"
//                       radius={[4, 4, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Code Coverage Chart */}
//             <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   Code Coverage Trend
//                 </h2>
//                 <div className="flex text-xs items-center">
//                   <div className="w-10 h-1 bg-gradient-to-r from-orange-400 to-blue-500 rounded mr-1"></div>
//                   <span>Coverage %</span>
//                 </div>
//               </div>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={coverageData}
//                     margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                     <XAxis dataKey="date" />
//                     <YAxis domain={[40, 100]} />
//                     <Tooltip
//                       formatter={(value) => [`${value}%`, "Coverage"]}
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: "none",
//                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="coverage"
//                       stroke="#3B82F6"
//                       strokeWidth={3}
//                       dot={{ r: 4, strokeWidth: 2 }}
//                       activeDot={{ r: 6, strokeWidth: 2 }}
//                     />
//                     {/* Target line */}
//                     <ReferenceLine
//                       y={80}
//                       stroke="#9333EA"
//                       strokeDasharray="3 3"
//                       label={{
//                         value: "Target (80%)",
//                         position: "insideBottomRight",
//                         fill: "#9333EA",
//                         fontSize: 12,
//                       }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Services Table & Risk Distribution */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//             <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
//               <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
//                 <h2 className="font-semibold text-gray-800 flex items-center">
//                   <Server size={18} className="mr-2 text-blue-600" />
//                   Service Status
//                 </h2>
//                 <div className="flex space-x-2">
//                   <button
//                     className={`px-2 py-1 text-xs rounded-full ${
//                       activeServiceFilter === "all"
//                         ? "bg-blue-100 text-blue-800"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                     onClick={() => setActiveServiceFilter("all")}
//                   >
//                     All
//                   </button>
//                   <button
//                     className={`px-2 py-1 text-xs rounded-full ${
//                       activeServiceFilter === "HIGH"
//                         ? "bg-red-100 text-red-800"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                     onClick={() => setActiveServiceFilter("HIGH")}
//                   >
//                     High Risk
//                   </button>
//                   <button
//                     className={`px-2 py-1 text-xs rounded-full ${
//                       activeServiceFilter === "MEDIUM"
//                         ? "bg-amber-100 text-amber-800"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                     onClick={() => setActiveServiceFilter("MEDIUM")}
//                   >
//                     Medium Risk
//                   </button>
//                   <button
//                     className={`px-2 py-1 text-xs rounded-full ${
//                       activeServiceFilter === "LOW"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                     onClick={() => setActiveServiceFilter("LOW")}
//                   >
//                     Low Risk
//                   </button>
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <div className="min-w-full divide-y divide-gray-200">
//                   <div className="bg-gray-50">
//                     <div className="grid grid-cols-5 px-6 py-3">
//                       <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Service
//                       </div>
//                       <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Coverage
//                       </div>
//                       <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Risk Level
//                       </div>
//                       <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Deployments
//                       </div>
//                       <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-white divide-y divide-gray-200">
//                     {filteredServices.map((service, index) => (
//                       <div
//                         key={index}
//                         className="grid grid-cols-5 hover:bg-gray-50"
//                       >
//                         <div className="px-6 py-3 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="ml-0">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {service.name}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="px-6 py-3 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-24 h-1.5 bg-gray-200 rounded-full mr-2">
//                               <div
//                                 className={`h-1.5 rounded-full ${
//                                   service.coverage >= 80
//                                     ? "bg-green-500"
//                                     : service.coverage >= 70
//                                     ? "bg-amber-500"
//                                     : "bg-red-500"
//                                 }`}
//                                 style={{ width: `${service.coverage}%` }}
//                               ></div>
//                             </div>
//                             <span className="text-xs font-medium text-gray-900">
//                               {service.coverage}%
//                             </span>
//                           </div>
//                         </div>
//                         <div className="px-6 py-3 whitespace-nowrap">
//                           <StatusBadge status={service.risk} />
//                         </div>
//                         <div className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {service.deployments} (
//                           {service.failures > 0 ? (
//                             <span className="text-red-500">
//                               {service.failures} failed
//                             </span>
//                           ) : (
//                             <span className="text-green-500">all ok</span>
//                           )}
//                           )
//                         </div>
//                         <div className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
//                           <button className="text-blue-600 hover:text-blue-900">
//                             Details
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Risk Distribution */}
//             <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                 <Shield size={18} className="mr-2 text-blue-600" />
//                 Risk Distribution
//               </h2>

//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={riskData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) =>
//                         `${name}: ${(percent * 100).toFixed(0)}%`
//                       }
//                     >
//                       {riskData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       formatter={(value, name) => [`${value} services`, name]}
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: "none",
//                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                       }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="mt-2 space-y-2">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
//                     <span className="text-sm text-gray-600">High Risk</span>
//                   </div>
//                   <span className="font-medium">
//                     {riskData && riskData.length > 0 ? riskData[0].value : 0}{" "}
//                     services
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
//                     <span className="text-sm text-gray-600">Medium Risk</span>
//                   </div>
//                   <span className="font-medium">
//                     {riskData && riskData.length > 1 ? riskData[1].value : 0}{" "}
//                     services
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
//                     <span className="text-sm text-gray-600">Low Risk</span>
//                   </div>
//                   <span className="font-medium">
//                     {riskData && riskData.length > 2 ? riskData[2].value : 0}{" "}
//                     services
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Deployments */}
//           <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden mb-6">
//             <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
//               <h2 className="font-semibold text-gray-800 flex items-center">
//                 <GitBranch size={18} className="mr-2 text-blue-600" />
//                 Recent Deployments
//               </h2>
//             </div>

//             <div className="overflow-x-auto">
//               <div className="min-w-full divide-y divide-gray-200">
//                 <div className="bg-gray-50">
//                   <div className="grid grid-cols-6 px-6 py-3">
//                     <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Service / Commit
//                     </div>
//                     <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Author
//                     </div>
//                     <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </div>
//                     <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Coverage
//                     </div>
//                     <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Changes
//                     </div>
//                     <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Time
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white divide-y divide-gray-200">
//                   {recentDeployments.map((deployment) => (
//                     <div
//                       key={deployment.id}
//                       className="grid grid-cols-6 hover:bg-gray-50"
//                     >
//                       <div className="px-6 py-3 whitespace-nowrap">
//                         <div className="flex flex-col">
//                           <div className="text-sm font-medium text-gray-900">
//                             {deployment.service_name}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             #{deployment.commit_hash}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="px-6 py-3 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {deployment.author}
//                         </div>
//                       </div>
//                       <div className="px-6 py-3 whitespace-nowrap">
//                         <StatusBadge status={deployment.status} />
//                       </div>
//                       <div className="px-6 py-3 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
//                             <div
//                               className={`h-1.5 rounded-full ${
//                                 deployment.coverage >= 80
//                                   ? "bg-green-500"
//                                   : deployment.coverage >= 70
//                                   ? "bg-amber-500"
//                                   : "bg-red-500"
//                               }`}
//                               style={{ width: `${deployment.coverage}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-xs font-medium text-gray-900">
//                             {deployment.coverage}%
//                           </span>
//                         </div>
//                       </div>
//                       <div className="px-6 py-3 whitespace-nowrap">
//                         <span className="text-xs font-medium">
//                           <span className="text-green-600">
//                             {deployment.changes.split(" ")[0]}
//                           </span>
//                           <span className="text-red-600">
//                             {deployment.changes.split(" ")[1]}
//                           </span>
//                         </span>
//                       </div>
//                       <div className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
//                         {deployment.timestamp}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default InfrastructureDashboard;
