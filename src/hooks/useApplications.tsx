import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getApplications } from '../lib/api';
import type { Application } from '../lib/types';

export default function useApplications() {
  const { token } = useAuth();

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

  const { data = [], isPending } = useQuery({
    queryKey: ['applications', token],
    queryFn: async () => {
      if (!token) return;
      const applications = await getApplications(token);
      return applications;
    },
    enabled: !!token,
  });

  const appliedInLastWeek: Application[] = [];

  const today = new Date();
  console.log(today);
  const lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7,
  );

  data.forEach((application: Application) => {
    if (new Date(application?.createdAt) >= new Date(lastWeek))
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

  console.log(lastWeek);

  return { data, isPending, byStatus, appliedInLastWeek };
}
