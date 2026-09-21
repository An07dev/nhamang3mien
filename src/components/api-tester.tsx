'use client';

import { useState } from 'react';
import { Send, Terminal, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
  description: string;
  body?: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'GET',
    url: '/api/health',
    description: 'Kiểm tra trạng thái server, uptime, memory usage',
  },
  {
    method: 'GET',
    url: '/api/todos',
    description: 'Lấy toàn bộ danh sách công việc từ backend database',
  },
  {
    method: 'POST',
    url: '/api/todos',
    description: 'Tạo một mục công việc mới qua REST API',
    body: JSON.stringify({ title: 'Task được tạo từ API Tester', priority: 'high' }, null, 2),
  },
];

export default function ApiTester() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState(selectedEndpoint.body || '');
  const [response, setResponse] = useState<unknown | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setRequestBody(endpoint.body || '');
  };

  const executeRequest = async () => {
    setLoading(true);
    setStatus(null);
    setResponse(null);
    const start = performance.now();

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (['POST', 'PATCH'].includes(selectedEndpoint.method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(selectedEndpoint.url, options);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setStatus(res.status);

      const json = await res.json();
      setResponse(json);
    } catch (err) {
      const end = performance.now();
      setLatency(Math.round(end - start));
      setStatus(500);
      setResponse({ error: 'Không thể kết nối đến API', details: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-500" />
            Trình kiểm thử REST API (Backend Explorer)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Gửi trực tiếp các HTTP Request tới các Route Handlers backend của Next.js
          </p>
        </div>
      </div>

      {/* Danh sách Endpoints mẫu */}
      <div className="mt-4 flex flex-wrap gap-2">
        {ENDPOINTS.map((ep, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(ep)}
            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border ${
              selectedEndpoint.url === ep.url && selectedEndpoint.method === ep.method
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs'
                : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span
              className={`font-bold uppercase text-[10px] px-1.5 py-0.5 rounded ${
                ep.method === 'GET'
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : ep.method === 'POST'
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                  : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}
            >
              {ep.method}
            </span>
            <span>{ep.url}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400">
        <b>Mục đích:</b> {selectedEndpoint.description}
      </div>

      {/* Thanh URL và nút gửi */}
      <div className="mt-4 flex gap-2">
        <div className="flex-1 flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 py-2 font-mono text-xs overflow-x-auto">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-2 uppercase">
            {selectedEndpoint.method}
          </span>
          <span className="text-zinc-800 dark:text-zinc-200">{selectedEndpoint.url}</span>
        </div>
        <button
          onClick={executeRequest}
          disabled={loading}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Gửi Request</span>
        </button>
      </div>

      {/* Body Request (nếu có) */}
      {['POST', 'PATCH'].includes(selectedEndpoint.method) && (
        <div className="mt-3">
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
            Request Payload (JSON):
          </label>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            rows={4}
            className="w-full p-3 font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-950 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Khung kết quả Response */}
      {(status !== null || loading) && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              API Response:
            </span>
            {status !== null && (
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-mono text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  {latency}ms
                </span>
                <span
                  className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${
                    status >= 200 && status < 300
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  }`}
                >
                  {status >= 200 && status < 300 ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                  HTTP {status}
                </span>
              </div>
            )}
          </div>
          <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs overflow-x-auto text-zinc-200">
            {loading ? (
              <div className="flex items-center gap-2 text-zinc-400 py-4 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Đang đợi phản hồi từ Backend...</span>
              </div>
            ) : (
              <pre className="text-emerald-400 whitespace-pre-wrap break-all">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
