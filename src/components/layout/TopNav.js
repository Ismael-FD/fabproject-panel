"use client";

import { Menu, X } from "lucide-react";

export default function TopNav({ onToggleSidebar, isSidebarOpen }) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">FC</span>
          </div>
          <span className="text-slate-900 font-semibold">FaChat</span>
        </div>
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-slate-600" />
          ) : (
            <Menu className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>
    </div>
  );
}
