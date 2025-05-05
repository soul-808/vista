import React from "react";
import { Calendar } from "lucide-react";

interface HeaderProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ timeRange, setTimeRange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="w-2 h-10 bg-red-600 mr-3"></div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">
                Vista Infrastructure Dashboard
              </h1>
              <p className="text-sm text-blue-600">
                Deployment Health & Code Quality Metrics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <select
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-1.5"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
