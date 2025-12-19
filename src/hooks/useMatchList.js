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
    staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
    gcTime: 10 * 60 * 1000, // 10分钟后清理缓存
    retry: 2, // 失败重试2次
  });

  return {
    matches,
    loading: isLoading,
    error: isError ? error : null,
    refetch,
  };
}
