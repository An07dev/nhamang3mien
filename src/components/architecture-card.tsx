import { Server, Monitor, FolderTree, ArrowRightLeft } from 'lucide-react';

export default function ArchitectureCard() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <FolderTree className="w-5 h-5 text-purple-500" />
        Cấu trúc dự án Fullstack (Next.js FE + BE)
      </h2>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cột Backend */}
        <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/60">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-semibold mb-3">
            <Server className="w-5 h-5" />
            <span>Backend Layer (Phía Máy Chủ)</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <div>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">src/app/api/.../route.ts</span>
                <p className="text-[11px] text-zinc-500 font-sans">Route Handlers xử lý REST API (GET, POST, PUT, DELETE).</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <div>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">src/actions/...</span>
                <p className="text-[11px] text-zinc-500 font-sans">Next.js Server Actions thực thi logic server trực tiếp khi gọi từ FE.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <div>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">src/lib/mongodb.ts & src/models/Todo.ts</span>
                <p className="text-[11px] text-zinc-500 font-sans">Kết nối MongoDB qua Mongoose ODM (port 27017, cached connection).</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Cột Frontend */}
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/60">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold mb-3">
            <Monitor className="w-5 h-5" />
            <span>Frontend Layer (Phía Giao Diện)</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <div>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">src/app/page.tsx</span>
                <p className="text-[11px] text-zinc-500 font-sans">Trang chủ render giao diện (Server Component hoặc Client Component).</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <div>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">src/components/...</span>
                <p className="text-[11px] text-zinc-500 font-sans">Các UI Component có thể tái sử dụng (React, Tailwind CSS).</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <div>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">src/types/...</span>
                <p className="text-[11px] text-zinc-500 font-sans">Chia sẻ Type Definition chung giữa FE và BE an toàn type-safe.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/60 flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
        <ArrowRightLeft className="w-4 h-4 text-indigo-500 shrink-0" />
        <span>
          <b>Giao tiếp FE ⇄ BE:</b> Frontend có thể gọi Backend thông qua <code>fetch(&apos;/api/...&apos;)</code> hoặc gọi trực tiếp Server Actions qua hook <code>useTransition</code>.
        </span>
      </div>
    </div>
  );
}
