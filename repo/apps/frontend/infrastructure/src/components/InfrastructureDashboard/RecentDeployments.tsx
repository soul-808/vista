import React from "react";
import { GitBranch } from "lucide-react";
import StatusBadge from "./StatusBadge";

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

interface RecentDeploymentsProps {
  recentDeployments: DeploymentItem[];
}

export const RecentDeployments: React.FC<RecentDeploymentsProps> = ({
  recentDeployments,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h2 className="font-semibold text-gray-800 flex items-center">
          <GitBranch size={18} className="mr-2 text-blue-600" />
          Recent Deployments
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-6 px-6 py-3">
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service / Commit
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coverage
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Changes
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {recentDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className="grid grid-cols-6 hover:bg-gray-50"
              >
                <div className="px-6 py-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {deployment.service_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      #{deployment.commit_hash}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {deployment.author}
                  </div>
                </div>
                <div className="px-6 py-3 whitespace-nowrap">
                  <StatusBadge status={deployment.status} />
                </div>
                <div className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                      <div
                        className={`h-1.5 rounded-full ${
                          deployment.coverage >= 80
                            ? "bg-green-500"
                            : deployment.coverage >= 70
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${deployment.coverage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-900">
                      {deployment.coverage}%
                    </span>
                  </div>
                </div>
                <div className="px-6 py-3 whitespace-nowrap">
                  <span className="text-xs font-medium">
                    <span className="text-green-600">
                      {deployment.changes.split(" ")[0]}
                    </span>
                    <span className="text-red-600">
                      {deployment.changes.split(" ")[1]}
                    </span>
                  </span>
                </div>
                <div className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  {deployment.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentDeployments;
