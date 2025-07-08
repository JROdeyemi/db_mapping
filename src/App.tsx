import React, { useState, useCallback } from 'react';
import { DatabaseSystem } from './components/DatabaseSystem';
import { ConnectionLines } from './components/ConnectionLines';
import { Header } from './components/Header';
import { DatabaseSystem as DatabaseSystemType, TableConnection } from './types/database';

function App() {
  const [v2System, setV2System] = useState<DatabaseSystemType>({
    databases: [],
  });
  
  const [v3System, setV3System] = useState<DatabaseSystemType>({
    databases: [],
  });
  
  const [connections, setConnections] = useState<TableConnection[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{ tableId: string; version: 'v2' | 'v3' } | null>(null);

  const handleStartConnection = useCallback((tableId: string, version: 'v2' | 'v3') => {
    setIsConnecting(true);
    setConnectionStart({ tableId, version });
  }, []);

  const handleEndConnection = useCallback((tableId: string, version: 'v2' | 'v3') => {
    if (!connectionStart || connectionStart.version === version) {
      setIsConnecting(false);
      setConnectionStart(null);
      return;
    }

    // Remove existing connections for these tables
    const filteredConnections = connections.filter(conn => 
      conn.v2TableId !== connectionStart.tableId && 
      conn.v3TableId !== connectionStart.tableId &&
      conn.v2TableId !== tableId && 
      conn.v3TableId !== tableId
    );

    // Create new connection
    const newConnection: TableConnection = {
      id: `connection-${Date.now()}`,
      v2TableId: connectionStart.version === 'v2' ? connectionStart.tableId : tableId,
      v3TableId: connectionStart.version === 'v3' ? connectionStart.tableId : tableId,
    };

    setConnections([...filteredConnections, newConnection]);
    setIsConnecting(false);
    setConnectionStart(null);
  }, [connectionStart, connections]);

  const handleCancelConnection = useCallback(() => {
    setIsConnecting(false);
    setConnectionStart(null);
  }, []);

  const handleRemoveConnection = useCallback((tableId: string) => {
    setConnections(connections.filter(conn => 
      conn.v2TableId !== tableId && conn.v3TableId !== tableId
    ));
  }, [connections]);

  const getTableElement = useCallback((tableId: string) => {
    return document.getElementById(`table-${tableId}`);
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <div id="main-container" className="flex-1 relative">
          <ConnectionLines
            connections={connections}
            getTableElement={getTableElement}
          />
          
          <div className="grid grid-cols-2 h-full">
            <div className="border-r border-gray-200">
              <DatabaseSystem
                version="v2"
                system={v2System}
                onUpdateSystem={setV2System}
                onStartConnection={handleStartConnection}
                onEndConnection={handleEndConnection}
                onCancelConnection={handleCancelConnection}
                onRemoveConnection={handleRemoveConnection}
                isConnecting={isConnecting}
                connectionStart={connectionStart}
                connections={connections}
              />
            </div>
            
            <div>
              <DatabaseSystem
                version="v3"
                system={v3System}
                onUpdateSystem={setV3System}
                onStartConnection={handleStartConnection}
                onEndConnection={handleEndConnection}
                onCancelConnection={handleCancelConnection}
                onRemoveConnection={handleRemoveConnection}
                isConnecting={isConnecting}
                connectionStart={connectionStart}
                connections={connections}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;