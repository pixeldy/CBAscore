import React from 'react';
import { X, RefreshCw } from 'lucide-react';
import { MatchSelect } from './MatchSelect';

/**
 * 顶部控制栏
 */
export function Header({ matches, selectedMatch, onSelectMatch, onRefresh, onClose, loading }) {
  return (
    <div className="flex items-center gap-2 p-4 border-b border-cba-border">
      <div className="flex-1">
        <MatchSelect
          matches={matches}
          selectedMatch={selectedMatch}
          onSelect={onSelectMatch}
          loading={loading}
        />
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="p-2 hover:bg-cba-bg/70 rounded-lg transition-colors disabled:opacity-50"
        aria-label="刷新"
        title="刷新比赛列表"
      >
        <RefreshCw
          className={`w-4 h-4 text-cba-text-secondary ${
            loading ? 'animate-spin' : ''
          }`}
        />
      </button>
      <button
        onClick={onClose}
        className="p-2 hover:bg-cba-bg/70 rounded-lg transition-colors"
        aria-label="关闭"
        title="关闭面板"
      >
        <X className="w-4 h-4 text-cba-text-secondary" />
      </button>
    </div>
  );
}
