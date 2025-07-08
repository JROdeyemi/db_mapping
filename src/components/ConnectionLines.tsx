import React, { useEffect, useState } from 'react';
import { TableConnection } from '../types/database';

interface ConnectionLinesProps {
  connections: TableConnection[];
  getTableElement: (tableId: string) => HTMLElement | null;
}

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  connections,
  getTableElement,
}) => {
  const [lines, setLines] = useState<LineCoordinates[]>([]);

  useEffect(() => {
    const updateLines = () => {
      const newLines: LineCoordinates[] = [];
      
      connections.forEach((connection) => {
        const v2Element = getTableElement(connection.v2TableId);
        const v3Element = getTableElement(connection.v3TableId);
        
        if (v2Element && v3Element) {
          const v2Rect = v2Element.getBoundingClientRect();
          const v3Rect = v3Element.getBoundingClientRect();
          const containerRect = document.getElementById('main-container')?.getBoundingClientRect();
          
          if (containerRect) {
            newLines.push({
              x1: v2Rect.right - containerRect.left - 8,
              y1: v2Rect.top + v2Rect.height / 2 - containerRect.top,
              x2: v3Rect.left - containerRect.left + 8,
              y2: v3Rect.top + v3Rect.height / 2 - containerRect.top,
            });
          }
        }
      });
      
      setLines(newLines);
    };

    updateLines();
    
    const handleResize = () => updateLines();
    window.addEventListener('resize', handleResize);
    
    // Update lines when DOM changes
    const observer = new MutationObserver(updateLines);
    const container = document.getElementById('main-container');
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [connections, getTableElement]);

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    >
      {lines.map((line, index) => (
        <g key={index}>
          <defs>
            <marker
              id={`arrowhead-${index}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#10b981"
              />
            </marker>
          </defs>
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="8,4"
            markerEnd={`url(#arrowhead-${index})`}
            className="drop-shadow-sm"
          />
        </g>
      ))}
    </svg>
  );
};