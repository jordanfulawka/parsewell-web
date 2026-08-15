import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getEditSuggestions } from '../lib/api';

export default function useEditSuggestions() {
  const params = useParams();
  const { token } = useAuth();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['editSuggestion', params.id, token],
    queryFn: async () => {
      if (!token) return;
      if (typeof params.id !== 'string') return;
      const editSuggestions = await getEditSuggestions(token, params.id);
      return editSuggestions;
    },
    enabled: !!token && typeof params.id === 'string',
  });

  return { data, isPending, isError, error };
}
