import React from 'react';
import { Database, Plus, Trash2 } from 'lucide-react';
import { DatabaseConfig, TableInfo } from '../types/database';

interface DatabasePanelProps {
  version: 'v2' | 'v3';
  config: DatabaseConfig;
  onConfigChange: (config: DatabaseConfig) => void;
  onTableDragStart: (tableId: string, version: 'v2' | 'v3') => void;
  onTableDragEnd: () => void;
  onTableDrop: (tableId: string, version: 'v2' | 'v3') => void;
  draggedTable: { id: string; version: 'v2' | 'v3' } | null;
  connections: Array<{ v2TableId: string; v3TableId: string }>;
}

export const DatabasePanel: React.FC<DatabasePanelProps> = ({
  version,
  config,
  onConfigChange,
  onTableDragStart,
  onTableDragEnd,
  onTableDrop,
  draggedTable,
  connections,
}) => {
  const addTable = () => {
    const newTable: TableInfo = {
      id: `${version}-table-${Date.now()}`,
      name: `table_${config.tables.length + 1}`,
      columns: [],
    };
    
    onConfigChange({
      ...config,
      tables: [...config.tables, newTable],
    });
  };

  const removeTable = (tableId: string) => {
    onConfigChange({
      ...config,
      tables: config.tables.filter(table => table.id !== tableId),
    });
  };

  const updateTableName = (tableId: string, name: string) => {
    onConfigChange({
      ...config,
      tables: config.tables.map(table => 
        table.id === tableId ? { ...table, name } : table
      ),
    });
  };

  const isConnected = (tableId: string) => {
    return connections.some(conn => 
      conn.v2TableId === tableId || conn.v3TableId === tableId
    );
  };

  const canDrop = draggedTable && draggedTable.version !== version;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          version === 'v2' ? 'bg-blue-100' : 'bg-green-100'
        }`}>
          <Database className={`h-5 w-5 ${
            version === 'v2' ? 'text-blue-600' : 'text-green-600'
          }`} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Database {version.toUpperCase()}
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Database Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => onConfigChange({ ...config, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter database name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schema (Optional)
          </label>
          <input
            type="text"
            value={config.schema}
            onChange={(e) => onConfigChange({ ...config, schema: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter schema name"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">Tables</h3>
          <button
            onClick={addTable}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Table
          </button>
        </div>
        
        <div 
          className={`min-h-[200px] p-3 border-2 border-dashed rounded-lg transition-all ${
            canDrop 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 bg-gray-50'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedTable && draggedTable.version !== version) {
              onTableDrop(draggedTable.id, version);
            }
          }}
        >
          <div className="space-y-2">
            {config.tables.map((table) => (
              <div
                key={table.id}
                id={`table-${table.id}`}
                draggable
                onDragStart={() => onTableDragStart(table.id, version)}
                onDragEnd={onTableDragEnd}
                className={`group p-3 rounded-lg cursor-move transition-all ${
                  isConnected(table.id)
                    ? 'bg-green-100 border-green-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:shadow-md'
                } border-2`}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={table.name}
                    onChange={(e) => updateTableName(table.id, e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-gray-800"
                    placeholder="Table name"
                  />
                  <button
                    onClick={() => removeTable(table.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {config.tables.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No tables yet. Add your first table above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};