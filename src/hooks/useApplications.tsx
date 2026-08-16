import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getApplications } from '../lib/api';
import type { Application } from '../lib/types';
import { useMemo } from 'react';

export default function useApplications() {
  const { token } = useAuth();

  const { data = [], isPending } = useQuery({
    queryKey: ['applications', token],
    queryFn: async () => {
      if (!token) return;
      const applications = await getApplications(token);
      return applications;
    },
    enabled: !!token,
  });

  const { byStatus, appliedInLastWeek } = useMemo(() => {
    const byStatus: {
      APPLIED: Application[];
      HEARD_BACK: Application[];
      REJECTED: Application[];
      GHOSTED: Application[];
      OTHER: Application[];
    } = {
      APPLIED: [],
      HEARD_BACK: [],
      REJECTED: [],
      GHOSTED: [],
      OTHER: [],
    };
    const appliedInLastWeek: Application[] = [];

    const today = new Date();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7,
    );

    data.forEach((application: Application) => {
      if (!application.createdAt) return;
      if (new Date(application.createdAt) >= lastWeek)
        appliedInLastWeek.push(application);
      switch (application.applicationStatus) {
        case 'APPLIED':
          byStatus['APPLIED'].push(application);
          break;
        case 'HEARD_BACK':
          byStatus['HEARD_BACK'].push(application);
          break;
        case 'REJECTED':
          byStatus['REJECTED'].push(application);
          break;
        case 'GHOSTED':
          byStatus['GHOSTED'].push(application);
          break;
        default:
          byStatus['OTHER'].push(application);
      }
    });

    return { byStatus, appliedInLastWeek };
  }, [data]);

  return { data, isPending, byStatus, appliedInLastWeek };
}
