import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getCoverLetter } from '../lib/api';

export default function useCoverLetter() {
  const params = useParams();
  const { token } = useAuth();

  const { data, isPending, error } = useQuery({
    queryKey: ['coverLetter', params.id, token],
    queryFn: async () => {
      if (!token) return;
      if (typeof params.id !== 'string') return;
      const coverLetter = await getCoverLetter(token, params.id);
      return coverLetter;
    },
  });

  return { data, isPending, error };
}
