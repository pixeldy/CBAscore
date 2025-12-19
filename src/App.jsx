import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FloatingBtn } from './components/FloatingBtn';
import { MainPanel } from './components/MainPanel';
import { useMatchList } from './hooks/useMatchList';
import { useLiveStats } from './hooks/useLiveStats';

// 创建QueryClient实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * 主应用组件
 */
function AppContent() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { matches, loading, error, refetch } = useMatchList();
  const { stats, loading: statsLoading, error: statsError } = useLiveStats(selectedMatch?.id);

  // 从localStorage恢复选中的比赛
  useEffect(() => {
    const savedMatchId = localStorage.getItem('cba-selected-match-id');
    if (savedMatchId && matches.length > 0) {
      const match = matches.find((m) => m.id === savedMatchId);
      if (match) {
        setSelectedMatch(match);
      }
    }
  }, [matches]);

  // 保存选中的比赛到localStorage
  useEffect(() => {
    if (selectedMatch) {
      localStorage.setItem('cba-selected-match-id', selectedMatch.id);
    }
  }, [selectedMatch]);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {!isExpanded && <FloatingBtn onClick={handleToggle} />}
      {isExpanded && (
        <MainPanel
          matches={matches}
          selectedMatch={selectedMatch}
          onSelectMatch={handleSelectMatch}
          onRefresh={refetch}
          onClose={handleClose}
          stats={stats}
          loading={loading || statsLoading}
          error={error || statsError}
        />
      )}
    </>
  );
}

/**
 * App根组件（包含QueryClientProvider）
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
