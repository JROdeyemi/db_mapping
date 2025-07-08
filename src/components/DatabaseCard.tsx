import React, { useState } from 'react';
import { Database, Plus, Trash2, Link, X, ChevronDown, ChevronRight } from 'lucide-react';
import { DatabaseConfig, TableInfo } from '../types/database';

interface DatabaseCardProps {
  database: DatabaseConfig;
  version: 'v2' | 'v3';
  onUpdateDatabase: (database: DatabaseConfig) => void;
  onDeleteDatabase: (databaseId: string) => void;
  onStartConnection: (tableId: string, version: 'v2' | 'v3') => void;
  onEndConnection: (tableId: string, version: 'v2' | 'v3') => void;
  onCancelConnection: () => void;
  onRemoveConnection: (tableId: string) => void;
  isConnecting: boolean;
  connectionStart: { tableId: string; version: 'v2' | 'v3' } | null;
  connections: Array<{ v2TableId: string; v3TableId: string }>;
}

export const DatabaseCard: React.FC<DatabaseCardProps> = ({
  database,
  version,
  onUpdateDatabase,
  onDeleteDatabase,
  onStartConnection,
  onEndConnection,
  onCancelConnection,
  onRemoveConnection,
  isConnecting,
  connectionStart,
  connections,
}) => {
  const [isTablesExpanded, setIsTablesExpanded] = useState(true);

  const addTable = () => {
    const newTable: TableInfo = {
      id: `${database.id}-table-${Date.now()}`,
      name: `table_${database.tables.length + 1}`,
      databaseId: database.id,
      columns: [],
    };
    
    onUpdateDatabase({
      ...database,
      tables: [...database.tables, newTable],
    });
  };

  const removeTable = (tableId: string) => {
    onUpdateDatabase({
      ...database,
      tables: database.tables.filter(table => table.id !== tableId),
    });
  };

  const updateTableName = (tableId: string, name: string) => {
    onUpdateDatabase({
      ...database,
      tables: database.tables.map(table => 
        table.id === tableId ? { ...table, name } : table
      ),
    });
  };

  const updateDatabaseName = (name: string) => {
    onUpdateDatabase({ ...database, name });
  };

  const updateDatabaseSchema = (schema: string) => {
    onUpdateDatabase({ ...database, schema });
  };

  const isConnected = (tableId: string) => {
    return connections.some(conn => 
      conn.v2TableId === tableId || conn.v3TableId === tableId
    );
  };

  const isConnectionTarget = () => {
    return isConnecting && connectionStart && connectionStart.version !== version;
  };

  const isConnectionSource = (tableId: string) => {
    return connectionStart?.tableId === tableId;
  };

  const handleTableClick = (tableId: string) => {
    if (isConnecting && connectionStart) {
      if (connectionStart.version !== version) {
        onEndConnection(tableId, version);
      } else {
        onCancelConnection();
      }
    } else {
      onStartConnection(tableId, version);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Database Header */}
      <div className={`p-4 border-b border-gray-200 ${
        version === 'v2' ? 'bg-blue-50' : 'bg-green-50'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              version === 'v2' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <Database className={`h-5 w-5 ${
                version === 'v2' ? 'text-blue-600' : 'text-green-600'
              }`} />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={database.name}
                onChange={(e) => updateDatabaseName(e.target.value)}
                className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 w-full"
                placeholder="Database name"
              />
            </div>
          </div>
          <button
            onClick={() => onDeleteDatabase(database.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        <input
          type="text"
          value={database.schema}
          onChange={(e) => updateDatabaseSchema(e.target.value)}
          className="w-full text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-600"
          placeholder="Schema (optional)"
        />
      </div>

      {/* Tables Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setIsTablesExpanded(!isTablesExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isTablesExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Tables ({database.tables.length})
            {!isTablesExpanded && database.tables.length > 0 && (
              <span className="text-xs text-gray-500 ml-1">- collapsed</span>
            )}
          </button>
          <button
            onClick={addTable}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
              version === 'v2' 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
        
        {isTablesExpanded && (
          <div className="min-h-[120px] space-y-1.5 transition-all duration-200">
            {database.tables.map((table) => (
              <div
                key={table.id}
                id={`table-${table.id}`}
                className={`group p-2.5 rounded-lg transition-all border cursor-pointer relative ${
                  isConnectionSource(table.id)
                    ? 'bg-yellow-100 border-yellow-300 shadow-md'
                    : isConnected(table.id)
                    ? version === 'v2'
                      ? 'bg-blue-100 border-blue-200 shadow-sm'
                      : 'bg-green-100 border-green-200 shadow-sm'
                      : isConnectionTarget()
                    ? 'bg-gray-100 border-gray-400 border-dashed'
                    : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
                }`}
                onClick={() => handleTableClick(table.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {isConnectionSource(table.id) && (
                      <Link className="h-4 w-4 text-yellow-600" />
                    )}
                    {isConnected(table.id) && !isConnectionSource(table.id) && (
                      <Link className={`h-4 w-4 ${
                        version === 'v2' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    )}
                    <input
                      type="text"
                      value={table.name}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateTableName(table.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-800"
                      placeholder="Table name"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    {isConnected(table.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveConnection(table.id);
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTable(table.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                  {isConnectionTarget() && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg">
                    <span className="text-xs font-medium text-gray-600">Click to connect</span>
                  </div>
                )}
              </div>
            ))}
            
            {database.tables.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No tables yet</p>
              </div>
            )}
          </div>
        )}
        
        {!isTablesExpanded && database.tables.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-xs">
              {database.tables.length} table{database.tables.length !== 1 ? 's' : ''} hidden
            </p>
          </div>
        )}
      </div>
      
      {isConnecting && connectionStart?.version === version && (
        <div className="p-3 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-700">
              Click a table in {version === 'v2' ? 'v3' : 'v2'} to connect
            </span>
            <button
              onClick={onCancelConnection}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};