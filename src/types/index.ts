export type Priority = 'low' | 'medium' | 'high';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  timestamp: string;
  version: string;
  nodeVersion: string;
  memoryUsage: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
  };
  database?: {
    status: 'connected' | 'connecting' | 'disconnecting' | 'disconnected';
    type: string;
  };
}
