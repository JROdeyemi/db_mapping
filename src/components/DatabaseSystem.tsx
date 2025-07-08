import React from 'react';
import { Plus, Server } from 'lucide-react';
import { DatabaseConfig, DatabaseSystem as DatabaseSystemType, TableConnection } from '../types/database';
import { DatabaseCard } from './DatabaseCard';

interface DatabaseSystemProps {
  version: 'v2' | 'v3';
  system: DatabaseSystemType;
  onUpdateSystem: (system: DatabaseSystemType) => void;
  onStartConnection: (tableId: string, version: 'v2' | 'v3') => void;
  onEndConnection: (tableId: string, version: 'v2' | 'v3') => void;
  onCancelConnection: () => void;
  onRemoveConnection: (tableId: string) => void;
  isConnecting: boolean;
  connectionStart: { tableId: string; version: 'v2' | 'v3' } | null;
  connections: TableConnection[];
}

export const DatabaseSystem: React.FC<DatabaseSystemProps> = ({
  version,
  system,
  onUpdateSystem,
  onStartConnection,
  onEndConnection,
  onCancelConnection,
  onRemoveConnection,
  isConnecting,
  connectionStart,
  connections,
}) => {
  const addDatabase = () => {
    const newDatabase: DatabaseConfig = {
      id: `${version}-db-${Date.now()}`,
      name: `${version}_database_${system.databases.length + 1}`,
      schema: '',
      tables: [],
    };
    
    onUpdateSystem({
      databases: [...system.databases, newDatabase],
    });
  };

  const updateDatabase = (updatedDatabase: DatabaseConfig) => {
    onUpdateSystem({
      databases: system.databases.map(db => 
        db.id === updatedDatabase.id ? updatedDatabase : db
      ),
    });
  };

  const deleteDatabase = (databaseId: string) => {
    onUpdateSystem({
      databases: system.databases.filter(db => db.id !== databaseId),
    });
  };

  return (
    <div className="flex-1 h-full">
      <div className={`p-6 border-b border-gray-200 ${
        version === 'v2' ? 'bg-blue-50' : 'bg-green-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              version === 'v2' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <Server className={`h-6 w-6 ${
                version === 'v2' ? 'text-blue-600' : 'text-green-600'
              }`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {version.toUpperCase()} Microservices
              </h2>
              <p className="text-gray-600">
                {system.databases.length} database{system.databases.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <button
            onClick={addDatabase}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              version === 'v2'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Plus className="h-4 w-4" />
            Add Database
          </button>
        </div>
      </div>
      
      <div className="p-6 h-full overflow-y-auto">
        <div className="space-y-6">
          {system.databases.map((database) => (
            <DatabaseCard
              key={database.id}
              database={database}
              version={version}
              onUpdateDatabase={updateDatabase}
              onDeleteDatabase={deleteDatabase}
              onStartConnection={onStartConnection}
              onEndConnection={onEndConnection}
              onCancelConnection={onCancelConnection}
              onRemoveConnection={onRemoveConnection}
              isConnecting={isConnecting}
              connectionStart={connectionStart}
              connections={connections}
            />
          ))}
          
          {system.databases.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Server className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No databases yet</h3>
              <p className="text-sm mb-4">Add your first microservice database to get started</p>
              <button
                onClick={addDatabase}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  version === 'v2'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Database
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};