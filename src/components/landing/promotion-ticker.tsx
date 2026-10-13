'use client';

import { useEffect, useState } from 'react';
import { getRecentLeadsAction, RecentLeadItem } from '@/actions/lead-actions';
import { Bell, Flame } from 'lucide-react';

export default function PromotionTicker() {
  const [leads, setLeads] = useState<RecentLeadItem[]>([]);

  useEffect(() => {
    let mounted = true;
    getRecentLeadsAction().then((items) => {
      if (mounted) setLeads(items);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (leads.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50 border-y border-orange-200/80 text-zinc-800 py-2.5 overflow-hidden relative shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Static Header Badge */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 px-3 py-1 rounded-full bg-white border border-orange-200 text-[#FF6320] text-xs font-black shadow-xs">
          <Flame className="w-3.5 h-3.5 text-[#FF6320] fill-[#FF6320] animate-bounce" />
          <span>Vừa Đăng Ký:</span>
        </div>

        {/* Marquee Scrolling Content */}
        <div className="overflow-hidden whitespace-nowrap w-full relative">
          <div className="animate-marquee gap-8">
            {leads.concat(leads).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center gap-2 text-xs bg-white px-3.5 py-1.5 rounded-full border border-orange-200/70 shadow-xs shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-zinc-900">{item.name}</span>
                <span className="text-[#FF6320] font-bold">{item.phoneMasked}</span>
                <span className="text-zinc-500">vừa đăng ký</span>
                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">{item.packageInterest}</span>
                <span className="text-[10px] text-zinc-400">({item.timeAgo})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
