import React from 'react';
import { GitBranch } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl">
          <GitBranch className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
};