import React, { useState, useRef, useEffect } from 'react';
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
  activeStatsTab,
  onStatsTabChange,
  activePlayerTeamTab,
  onPlayerTeamTabChange,
}) {
  const [panelWidth, setPanelWidth] = useState(() => {
    const savedWidth = localStorage.getItem('cba-panel-width');
    const min = 360;
    const max = Math.max(min, window.innerWidth - 40);
    if (savedWidth) {
      const w = Number(savedWidth);
      return Math.max(min, Math.min(w, max));
    }
    return 360;
  });
  const [panelTop, setPanelTop] = useState(() => {
    const savedTop = localStorage.getItem('cba-floating-btn-top');
    return savedTop ? Number(savedTop) : Math.floor(window.innerHeight / 2);
  });
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(360);

  const handleResizeMouseDown = (e) => {
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = panelWidth;
    window.addEventListener('mousemove', handleResizeMouseMove);
    window.addEventListener('mouseup', handleResizeMouseUp);
    e.preventDefault();
  };

  const handleResizeMouseMove = (e) => {
    if (!isResizingRef.current) return;
    const delta = startXRef.current - e.clientX;
    let next = startWidthRef.current + delta;
    const min = 360;
    const max = Math.max(min, Math.min(window.innerWidth - 40, 1200));
    if (next < min) next = min;
    if (next > max) next = max;
    setPanelWidth(next);
  };

  const handleResizeMouseUp = () => {
    isResizingRef.current = false;
    window.removeEventListener('mousemove', handleResizeMouseMove);
    window.removeEventListener('mouseup', handleResizeMouseUp);
  };

  useEffect(() => {
    // 初始宽度已在 useState 中处理
    const syncTop = () => {
      const savedTop = localStorage.getItem('cba-floating-btn-top');
      if (savedTop) {
        const min = 40;
        const max = Math.max(min, window.innerHeight - 40);
        const t = Math.min(Math.max(Number(savedTop), min), max);
        setPanelTop(t);
      }
    };
    syncTop();
    window.addEventListener('resize', syncTop);
    return () => window.removeEventListener('resize', syncTop);
  }, []);

  useEffect(() => {
    localStorage.setItem('cba-panel-width', String(panelWidth));
  }, [panelWidth]);

  return (
    <div 
      className="pointer-events-auto fixed right-4 -translate-y-1/2 z-50 h-[80vh] bg-cba-bg backdrop-blur-lg border border-cba-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
      style={{ width: panelWidth, minWidth: 360, top: panelTop }}
      onMouseLeave={() => { if (!isResizingRef.current) onClose(); }}
    >
      <div
        onMouseDown={handleResizeMouseDown}
        style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', cursor: 'ew-resize' }}
      />
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
              homeTeamStats={stats?.homeTeam?.stats}
              awayTeamStats={stats?.awayTeam?.stats}
              status={selectedMatch.status}
            />
            {stats ? (
              <StatsTabs 
                stats={stats}
                activeTab={activeStatsTab}
                onTabChange={onStatsTabChange}
                activePlayerTeamTab={activePlayerTeamTab}
                onPlayerTeamTabChange={onPlayerTeamTabChange}
              />
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
