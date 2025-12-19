import { useQuery } from '@tanstack/react-query';
import { fetchMatchStats } from '../utils/api';
import { parseMatchStats } from '../utils/dataParser';

/**
 * 获取实时统计数据的Hook
 * 每10秒轮询一次
 */
export function useLiveStats(matchId) {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['matchStats', matchId],
    queryFn: async () => {
      if (!matchId) return null;
      const data = await fetchMatchStats(matchId);
      return parseMatchStats(data);
    },
    enabled: !!matchId, // 只有matchId存在时才启用查询
    refetchInterval: 10000, // 每10秒轮询一次
    staleTime: 0, // 数据立即过期，确保每次都获取最新数据
    gcTime: 30 * 1000, // 30秒后清理缓存
    retry: 1, // 失败重试1次
    retryDelay: 2000, // 重试延迟2秒
  });

  return {
    stats,
    loading: isLoading,
    error: isError ? error : null,
  };
}
