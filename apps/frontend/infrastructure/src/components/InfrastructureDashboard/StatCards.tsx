import React from "react";
import {
  Activity,
  Code,
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

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

interface ServiceDataItem {
  name: string;
  coverage: number;
  risk: string;
  deployments: number;
  failures: number;
}

interface StatCardsProps {
  deploymentData: DeploymentDataItem[];
  coverageData: CoverageDataItem[];
  serviceData: ServiceDataItem[];
}

export const StatCards: React.FC<StatCardsProps> = ({
  deploymentData,
  coverageData,
  serviceData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Deployments Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Deployments
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {deploymentData.reduce((sum, item) => sum + item.total, 0)}
            </p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity size={20} className="text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span>
              Success:{" "}
              {deploymentData.reduce((sum, item) => sum + item.success, 0)}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
            <span>
              Failed:{" "}
              {deploymentData.reduce((sum, item) => sum + item.failure, 0)}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
            <span>
              Rollback:{" "}
              {deploymentData.reduce((sum, item) => sum + item.rollback, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Code Coverage Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Avg. Code Coverage
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {coverageData.length > 0
                ? `${(
                    coverageData.reduce((sum, item) => sum + item.coverage, 0) /
                    coverageData.length
                  ).toFixed(1)}%`
                : "0%"}
            </p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Code size={20} className="text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <TrendingUp size={14} className="text-green-500 mr-1" />
            <span>+2.3% from last period</span>
          </div>
          <span className="text-blue-600 font-medium">Target: 80%</span>
        </div>
      </div>

      {/* Services at Risk Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Services at Risk
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {serviceData.filter((s) => s.risk === "HIGH").length}
            </p>
          </div>
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
            <span>
              High: {serviceData.filter((s) => s.risk === "HIGH").length}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-1"></div>
            <span>
              Medium: {serviceData.filter((s) => s.risk === "MEDIUM").length}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span>
              Low: {serviceData.filter((s) => s.risk === "LOW").length}
            </span>
          </div>
        </div>
      </div>

      {/* Auth Errors Card */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Auth Errors</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor(Math.random() * 5)}
            </p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield size={20} className="text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <TrendingDown size={14} className="text-green-500 mr-1" />
            <span>-35% from last period</span>
          </div>
          <span className="text-blue-600 font-medium">Last: 2 hrs ago</span>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
 