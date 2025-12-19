import React from 'react';
import { Activity } from 'lucide-react';

/**
 * 收起态悬浮按钮
 */
export function FloatingBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-cba-bg backdrop-blur-lg border border-cba-border flex items-center justify-center hover:bg-cba-orange/20 transition-all duration-300 shadow-lg hover:scale-110"
      aria-label="展开数据面板"
    >
      <Activity className="w-6 h-6 text-cba-orange" />
    </button>
  );
}
