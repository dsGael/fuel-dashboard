import { useQuery } from '@tanstack/react-query';
import { getAutobuses } from '../api/client';

export function useAutobuses() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['autobuses'],
    queryFn: getAutobuses,
    staleTime: 5 * 60 * 1000,
  });
  return { autobuses: data, loading: isLoading };
}
