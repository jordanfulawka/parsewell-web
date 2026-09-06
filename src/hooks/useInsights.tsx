import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getInsights } from '../lib/api';

export default function useInsights() {
  const { token } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: ['insights', token],
    queryFn: async () => {
      if (!token) return;
      const insights = await getInsights(token);
      return insights;
    },
    enabled: !!token,
  });

  return { data, isPending, error };
}
