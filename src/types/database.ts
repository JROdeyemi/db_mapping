export interface DatabaseConfig {
  id: string;
  name: string;
  schema: string;
  tables: TableInfo[];
}

export interface TableInfo {
  id: string;
  name: string;
  databaseId: string;
  columns?: string[];
}

export interface TableConnection {
  id: string;
  v2TableId: string;
  v3TableId: string;
}

export interface DatabaseSystem {
  databases: DatabaseConfig[];
}