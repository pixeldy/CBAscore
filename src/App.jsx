import React, { useEffect, useMemo, useState } from 'react';
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
const SELECTED_MATCH_ID_KEY = 'cba-selected-match-id';

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
  const [selectedMatchId, setSelectedMatchId] = useState(() => {
    try {
      return localStorage.getItem(SELECTED_MATCH_ID_KEY);
    } catch {
      return null;
    }
  });
  const { matches, loading, error, refetch } = useMatchList();
  const selectedMatch = useMemo(() => {
    if (!selectedMatchId) return null;
    return matches.find((m) => m.id === selectedMatchId) || null;
  }, [matches, selectedMatchId]);
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

  useEffect(() => {
    try {
      if (selectedMatchId) localStorage.setItem(SELECTED_MATCH_ID_KEY, selectedMatchId);
      else localStorage.removeItem(SELECTED_MATCH_ID_KEY);
    } catch {
    }
  }, [selectedMatchId]);

  const handleSelectMatch = (match) => {
    const nextId = match?.id || null;
    setSelectedMatchId(nextId);
    try {
      if (nextId) localStorage.setItem(SELECTED_MATCH_ID_KEY, nextId);
      else localStorage.removeItem(SELECTED_MATCH_ID_KEY);
    } catch {
    }
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
