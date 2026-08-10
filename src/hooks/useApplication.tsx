import { useEffect, useState } from 'react';
import type { Application } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router';
import { getApplicationById, updateApplication } from '../lib/api';

export default function useApplication() {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAuth();
  const params = useParams();

  useEffect(() => {
    async function fetchApplication() {
      try {
        if (!token) return;
        if (typeof params.id !== 'string') return;
        setIsLoading(true);
        const application = await getApplicationById(token, params.id);
        setApplication(application);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplication();
  }, [token, params.id]);

  async function updateStatus(status: string) {
    if (!token) return;
    if (!application) return;
    const oldStatus = application.applicationStatus;
    try {
      const updated = { ...application, applicationStatus: status };
      setApplication(updated);
      await updateApplication(token, updated);
    } catch (err: any) {
      setError(err);
      setApplication({ ...application, applicationStatus: oldStatus });
    }
  }

  return { application, isLoading, error, updateStatus };
}
