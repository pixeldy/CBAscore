import { useQuery } from '@tanstack/react-query';
import { fetchMatchList } from '../utils/api';
import { parseMatchList } from '../utils/dataParser';

/**
 * 获取比赛列表的Hook
 */
export function useMatchList() {
  const {
    data: matches = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['matchList'],
    queryFn: async () => {
      const data = await fetchMatchList();
      return parseMatchList(data);
    },
    staleTime: 10 * 1000, // 15秒内数据视为新鲜
    gcTime: 10 * 60 * 1000, // 10分钟后清理缓存
    refetchInterval: 10000, // 每10秒轮询一次
    refetchOnWindowFocus: true, // 窗口聚焦时刷新
    retry: 2, // 失败重试2次
  });

  return {
    matches,
    loading: isLoading,
    error: isError ? error : null,
    refetch,
  };
}
