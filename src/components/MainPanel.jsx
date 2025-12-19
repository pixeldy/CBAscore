import React from 'react';
import { Header } from './Header';
import { ScoreBoard } from './ScoreBoard';
import { StatsTabs } from './StatsTabs';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

/**
 * 主面板组件（展开态）
 */
export function MainPanel({
  matches,
  selectedMatch,
  onSelectMatch,
  onRefresh,
  onClose,
  stats,
  loading,
  error,
}) {
  return (
    <div 
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-[360px] h-[80vh] bg-cba-bg backdrop-blur-lg border border-cba-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
      onMouseLeave={onClose}
    >
      <Header
        matches={matches}
        selectedMatch={selectedMatch}
        onSelectMatch={onSelectMatch}
        onRefresh={onRefresh}
        onClose={onClose}
        loading={loading}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <ErrorMessage message={error.message || '加载失败，请稍后重试'} onRetry={onRefresh} />
        )}
        
        {loading && !selectedMatch && <LoadingSpinner />}
        
        {selectedMatch && !error && (
          <>
            <ScoreBoard
              homeTeam={selectedMatch.homeTeam}
              awayTeam={selectedMatch.awayTeam}
              status={selectedMatch.status}
            />
            {stats ? (
              <StatsTabs stats={stats} />
            ) : (
              <div className="p-8 text-center text-cba-text-secondary">
                <LoadingSpinner />
                <p className="mt-4">加载统计数据中...</p>
              </div>
            )}
          </>
        )}
        {!selectedMatch && !loading && !error && (
          <div className="p-8 text-center text-cba-text-secondary">
            请从上方下拉框选择比赛
          </div>
        )}
      </div>
    </div>
  );
}
