'use client';

import { useState, useEffect } from 'react';
import { Database, RefreshCw, X, User, Phone, MapPin, Calendar } from 'lucide-react';

interface LeadItem {
  _id: string;
  name: string;
  phone: string;
  province?: string;
  packageInterest?: string;
  note?: string;
  createdAt: string;
}

export default function LeadListModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      const json = await res.json();
      if (json.success) {
        setLeads(json.data || []);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen]);

  return (
    <>
      {/* Discreet Trigger Button (Desktop Only to prevent overlapping mobile action bar) */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex fixed bottom-6 left-5 z-40 items-center gap-2 px-3 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs font-semibold shadow-lg border border-zinc-700/80 backdrop-blur-md cursor-pointer transition-transform hover:scale-105"
        title="Xem các đơn đăng ký đã lưu trong MongoDB"
      >
        <Database className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">MongoDB Leads:</span>
        <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
          Live Data
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[85vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                    Khách Hàng Đăng Ký (Lưu Trong MongoDB)
                  </h3>
                  <p className="text-[11px] text-zinc-500">Collection: <code>leads</code></p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLeads}
                  disabled={loading}
                  className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  title="Làm mới"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="p-5 overflow-y-auto space-y-3 divide-y divide-zinc-100 dark:divide-zinc-800">
              {leads.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 text-xs">
                  {loading ? 'Đang tải dữ liệu từ MongoDB...' : 'Chưa có đơn đăng ký nào. Hãy thử điền form trên trang để kiểm tra!'}
                </div>
              ) : (
                leads.map((l) => (
                  <div key={l._id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-bold text-zinc-900 dark:text-white text-sm">{l.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-[#FF6320] font-bold text-[10px]">
                          {l.packageInterest || 'Chưa chọn'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-zinc-500 text-[11px]">
                        <span className="flex items-center gap-1 font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                          <Phone className="w-3 h-3 text-[#FF6320]" />
                          {l.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {l.province || 'Toàn quốc'}
                        </span>
                        {l.note && (
                          <span className="italic text-zinc-400">
                            &ldquo;{l.note}&rdquo;
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(l.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 text-center text-[11px] text-zinc-500">
              Tổng số: <strong>{leads.length}</strong> lượt đăng ký đã được ghi nhận trong cơ sở dữ liệu MongoDB
            </div>

          </div>
        </div>
      )}
    </>
  );
}
