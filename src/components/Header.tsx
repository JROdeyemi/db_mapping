import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Database Schema Mapping Tool
          </h1>
        </div>
      </div>
    </div>
  );
};