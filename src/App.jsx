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

const SHOW_FLOATING_BALL_KEY = 'cba-show-floating-ball';

function getStorageApi() {
  if (typeof chrome !== 'undefined' && chrome?.storage?.local) return chrome.storage.local;
  return null;
}

/**
 * 主应用组件
 */
function AppContent() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFloatingBall, setShowFloatingBall] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { matches, loading, error, refetch } = useMatchList();
  const { stats, loading: statsLoading, error: statsError } = useLiveStats(selectedMatch?.id);

  useEffect(() => {
    let mounted = true;
    const storage = getStorageApi();

    const load = async () => {
      try {
        if (storage) {
          const res = await storage.get({ [SHOW_FLOATING_BALL_KEY]: true });
          if (mounted) setShowFloatingBall(Boolean(res[SHOW_FLOATING_BALL_KEY]));
          return;
        }

        const saved = localStorage.getItem(SHOW_FLOATING_BALL_KEY);
        if (!mounted) return;
        if (saved === null) setShowFloatingBall(true);
        else setShowFloatingBall(saved === 'true');
      } catch {
        if (mounted) setShowFloatingBall(true);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const storage = getStorageApi();
    if (storage && chrome?.storage?.onChanged) {
      const handler = (changes, areaName) => {
        if (areaName !== 'local') return;
        if (!changes[SHOW_FLOATING_BALL_KEY]) return;
        setShowFloatingBall(Boolean(changes[SHOW_FLOATING_BALL_KEY].newValue));
      };
      chrome.storage.onChanged.addListener(handler);
      return () => chrome.storage.onChanged.removeListener(handler);
    }

    const handler = (e) => {
      if (e.key !== SHOW_FLOATING_BALL_KEY) return;
      setShowFloatingBall(e.newValue === null ? true : e.newValue === 'true');
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    if (!showFloatingBall) setIsExpanded(false);
  }, [showFloatingBall]);

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

  if (!showFloatingBall) return null;

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
