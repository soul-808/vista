import React, { useState, useEffect } from "react";
import Header from "./Header";
import StatCards from "./StatCards";
import DeploymentTrendChart from "./DeploymentTrendChart";
import CodeCoverageChart from "./CodeCoverageChart";
import ServiceStatus from "./ServiceStatus";
import RiskDistribution from "./RiskDistribution";
import RecentDeployments from "./RecentDeployments";

// Define types for our data
interface DeploymentDataItem {
  date: string;
  success: number;
  failure: number;
  rollback: number;
  total: number;
}

interface CoverageDataItem {
  date: string;
  coverage: number;
}

interface RiskDataItem {
  name: string;
  value: number;
  color: string;
}

interface ServiceDataItem {
  name: string;
  coverage: number;
  risk: string;
  deployments: number;
  failures: number;
}

interface DeploymentItem {
  id: string;
  service_name: string;
  commit_hash: string;
  author: string;
  status: string;
  coverage: number;
  risk_level: string;
  timestamp: string;
  changes: string;
}

/**
 * InfrastructureDashboard Component
 * Main dashboard for infrastructure monitoring and management
 */
const InfrastructureDashboard: React.FC = () => {
  // State for all the data
  const [deploymentData, setDeploymentData] = useState<DeploymentDataItem[]>(
    []
  );
  const [coverageData, setCoverageData] = useState<CoverageDataItem[]>([]);
  const [riskData, setRiskData] = useState<RiskDataItem[]>([]);
  const [serviceData, setServiceData] = useState<ServiceDataItem[]>([]);
  const [recentDeployments, setRecentDeployments] = useState<DeploymentItem[]>(
    []
  );
  const [timeRange, setTimeRange] = useState("7d");
  const [activeServiceFilter, setActiveServiceFilter] = useState("all");

  // Mock data loading
  useEffect(() => {
    // Generate sample data based on time range
    generateMockData(timeRange);
  }, [timeRange]);

  // Mock data generator function - imported from TestInfrastructureDashboard
  const generateMockData = (range: string) => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;

    // Generate deployment data
    const deployData: DeploymentDataItem[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Random daily deployments between 1-5
      const dailyDeployments = Math.floor(Math.random() * 5) + 1;
      const success = Math.floor(Math.random() * dailyDeployments);
      const failure = Math.floor(Math.random() * (dailyDeployments - success));
      const rollback = dailyDeployments - success - failure;

      deployData.push({
        date: dateStr,
        success,
        failure,
        rollback,
        total: dailyDeployments,
      });
    }

    setDeploymentData(deployData);

    // Generate coverage data
    const coverage: CoverageDataItem[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (days - i - 1));
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Random coverage trending upward slightly
      const baseValue = 68 + (i / days) * 10;
      const randomVariation = Math.random() * 8 - 4; // Random variation between -4 and 4
      const coverageValue = Math.min(
        95,
        Math.max(60, baseValue + randomVariation)
      );

      coverage.push({
        date: dateStr,
        coverage: parseFloat(coverageValue.toFixed(1)),
      });
    }

    setCoverageData(coverage);

    // Generate risk data
    const risk: RiskDataItem[] = [
      { name: "High", value: 3, color: "#EF4444" },
      { name: "Medium", value: 7, color: "#F59E0B" },
      { name: "Low", value: 12, color: "#10B981" },
    ];

    setRiskData(risk);

    // Generate service data
    const services: ServiceDataItem[] = [
      {
        name: "Auth Service",
        coverage: 87.2,
        risk: "LOW",
        deployments: 5,
        failures: 0,
      },
      {
        name: "Payment Gateway",
        coverage: 92.5,
        risk: "LOW",
        deployments: 3,
        failures: 0,
      },
      {
        name: "User Management",
        coverage: 78.4,
        risk: "MEDIUM",
        deployments: 6,
        failures: 1,
      },
      {
        name: "Notification Service",
        coverage: 65.2,
        risk: "HIGH",
        deployments: 2,
        failures: 1,
      },
      {
        name: "Order Processing",
        coverage: 83.9,
        risk: "LOW",
        deployments: 4,
        failures: 0,
      },
      {
        name: "Reporting API",
        coverage: 72.6,
        risk: "MEDIUM",
        deployments: 7,
        failures: 2,
      },
      {
        name: "Admin Dashboard",
        coverage: 56.8,
        risk: "HIGH",
        deployments: 3,
        failures: 1,
      },
      {
        name: "Customer Portal",
        coverage: 88.5,
        risk: "LOW",
        deployments: 4,
        failures: 0,
      },
    ];

    setServiceData(services);

    // Generate recent deployments
    const recentDeploys: DeploymentItem[] = [
      {
        id: "cd48e22a",
        service_name: "Payment Gateway",
        commit_hash: "a5f7c91",
        author: "Sarah Chen",
        status: "SUCCESS",
        coverage: 92.5,
        risk_level: "LOW",
        timestamp: "10 minutes ago",
        changes: "+124 -56",
      },
      {
        id: "bf31e90c",
        service_name: "Notification Service",
        commit_hash: "e2d8f45",
        author: "Mike Johnson",
        status: "FAIL",
        coverage: 65.2,
        risk_level: "HIGH",
        timestamp: "2 hours ago",
        changes: "+87 -32",
      },
      {
        id: "a97c3d21",
        service_name: "User Management",
        commit_hash: "f9b3a12",
        author: "David Lee",
        status: "SUCCESS",
        coverage: 78.4,
        risk_level: "MEDIUM",
        timestamp: "4 hours ago",
        changes: "+215 -189",
      },
      {
        id: "56e2f901",
        service_name: "Admin Dashboard",
        commit_hash: "c4d2e67",
        author: "Emma Wilson",
        status: "ROLLBACK",
        coverage: 56.8,
        risk_level: "HIGH",
        timestamp: "6 hours ago",
        changes: "+56 -12",
      },
      {
        id: "32d9a74e",
        service_name: "Auth Service",
        commit_hash: "b3a17d9",
        author: "James Taylor",
        status: "SUCCESS",
        coverage: 87.2,
        risk_level: "LOW",
        timestamp: "8 hours ago",
        changes: "+43 -19",
      },
    ];

    setRecentDeployments(recentDeploys);
  };

  return (
    <div className="min-h-100 bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Header */}
      <Header timeRange={timeRange} setTimeRange={setTimeRange} />

      {/* Main Content */}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Stats Cards */}
          <StatCards
            deploymentData={deploymentData}
            coverageData={coverageData}
            serviceData={serviceData}
          />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <DeploymentTrendChart deploymentData={deploymentData} />
            <CodeCoverageChart coverageData={coverageData} />
          </div>

          {/* Services Table & Risk Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ServiceStatus
                serviceData={serviceData}
                activeServiceFilter={activeServiceFilter}
                setActiveServiceFilter={setActiveServiceFilter}
              />
            </div>
            <RiskDistribution riskData={riskData} />
          </div>

          {/* Recent Deployments */}
          <RecentDeployments recentDeployments={recentDeployments} />
        </div>
      </main>
    </div>
  );
};

export default InfrastructureDashboard;
