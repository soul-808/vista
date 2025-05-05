import React from "react";
import { Server } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface ServiceItem {
  name: string;
  coverage: number;
  risk: string;
  deployments: number;
  failures: number;
}

interface ServiceStatusProps {
  serviceData: ServiceItem[];
  activeServiceFilter: string;
  setActiveServiceFilter: (filter: string) => void;
}

export const ServiceStatus: React.FC<ServiceStatusProps> = ({
  serviceData,
  activeServiceFilter,
  setActiveServiceFilter,
}) => {
  // Filter services based on active filter
  const filteredServices =
    activeServiceFilter === "all"
      ? serviceData
      : serviceData.filter((service) => service.risk === activeServiceFilter);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 flex items-center">
          <Server size={18} className="mr-2 text-blue-600" />
          Service Status
        </h2>
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 text-xs rounded-full ${
              activeServiceFilter === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveServiceFilter("all")}
          >
            All
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-full ${
              activeServiceFilter === "HIGH"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveServiceFilter("HIGH")}
          >
            High Risk
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-full ${
              activeServiceFilter === "MEDIUM"
                ? "bg-amber-100 text-amber-800"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveServiceFilter("MEDIUM")}
          >
            Medium Risk
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-full ${
              activeServiceFilter === "LOW"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveServiceFilter("LOW")}
          >
            Low Risk
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-5 px-6 py-3">
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coverage
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deployments
              </div>
              <div className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service, index) => (
              <div key={index} className="grid grid-cols-5 hover:bg-gray-50">
                <div className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-0">
                      <div className="text-sm font-medium text-gray-900">
                        {service.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full mr-2">
                      <div
                        className={`h-1.5 rounded-full ${
                          service.coverage >= 80
                            ? "bg-green-500"
                            : service.coverage >= 70
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${service.coverage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-900">
                      {service.coverage}%
                    </span>
                  </div>
                </div>
                <div className="px-6 py-3 whitespace-nowrap">
                  <StatusBadge status={service.risk} />
                </div>
                <div className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  {service.deployments} (
                  {service.failures > 0 ? (
                    <span className="text-red-500">
                      {service.failures} failed
                    </span>
                  ) : (
                    <span className="text-green-500">all ok</span>
                  )}
                  )
                </div>
                <div className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatus;
