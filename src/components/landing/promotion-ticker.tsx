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
    <div className="bg-[#1F2636] border-y border-zinc-800 text-zinc-200 py-2.5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Static Header Badge */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 px-3 py-1 rounded-full bg-[#FF6320]/20 border border-[#FF6320]/40 text-[#FFA153] text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-[#FF6320] fill-[#FF6320] animate-bounce" />
          <span>Vừa Đăng Ký:</span>
        </div>

        {/* Marquee Scrolling Content */}
        <div className="overflow-hidden whitespace-nowrap w-full relative">
          <div className="animate-marquee gap-8">
            {leads.concat(leads).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="inline-flex items-center gap-2 text-xs bg-zinc-800/80 px-3.5 py-1.5 rounded-lg border border-zinc-700/60 shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-white">{item.name}</span>
                <span className="text-[#FFCD6C] font-mono">{item.phoneMasked}</span>
                <span className="text-zinc-400">đã đăng ký</span>
                <span className="font-bold text-[#FFA153]">{item.packageInterest}</span>
                <span className="text-[10px] text-zinc-500">({item.timeAgo})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
