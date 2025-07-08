import React from 'react';
import { GitBranch, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl">
            <GitBranch className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Microservice Schema Mapper
            </h1>
            <p className="text-gray-600 mt-1">
              Map your v2 microservice databases to v3 architecture for seamless migration
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium">
              v2 Legacy
            </span>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-medium">
              v3 Modern
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};