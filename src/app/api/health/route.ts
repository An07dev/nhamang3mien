import { NextResponse } from 'next/server';
import { ApiResponse, SystemHealth } from '@/types';
import { connectDB, getDbState } from '@/lib/mongodb';

export async function GET() {
  const memory = process.memoryUsage();
  const formatMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  let dbStatus = getDbState();
  if (dbStatus !== 'connected') {
    try {
      await connectDB();
      dbStatus = getDbState();
    } catch {
      dbStatus = 'disconnected';
    }
  }

  const healthData: SystemHealth = {
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    nodeVersion: process.version,
    database: {
      status: dbStatus,
      type: 'MongoDB (Mongoose)',
    },
    memoryUsage: {
      rss: formatMb(memory.rss),
      heapTotal: formatMb(memory.heapTotal),
      heapUsed: formatMb(memory.heapUsed),
    },
  };

  const response: ApiResponse<SystemHealth> = {
    success: true,
    data: healthData,
    message: 'Backend API & MongoDB is running',
  };

  return NextResponse.json(response, { status: 200 });
}
