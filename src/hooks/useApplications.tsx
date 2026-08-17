import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getApplications } from '../lib/api';
import type { Application } from '../lib/types';
import { useMemo, useState } from 'react';

type SortBy =
  | 'Recently updated'
  | 'Newest first'
  | 'Oldest first'
  | 'Company A-Z';

const SORT_OPTIONS: SortBy[] = [
  'Recently updated',
  'Newest first',
  'Oldest first',
  'Company A-Z',
];

function isSortBy(value: string | null): value is SortBy {
  return value != null && SORT_OPTIONS.includes(value as SortBy);
}

export default function useApplications() {
  const { token } = useAuth();

  const [searchQuery, setSearchQueryState] = useState(
    () => localStorage.getItem('searchQuery') ?? '',
  );
  const [sortBy, setSortByState] = useState<SortBy>(() => {
    const stored = localStorage.getItem('sortBy');
    return isSortBy(stored) ? stored : 'Recently updated';
  });

  function setSearchQuery(query: string) {
    localStorage.setItem('searchQuery', query);
    setSearchQueryState(query);
  }

  function setSortBy(value: SortBy) {
    localStorage.setItem('sortBy', value);
    setSortByState(value);
  }

  const { data = [], isPending } = useQuery({
    queryKey: ['applications', token],
    queryFn: async () => {
      if (!token) return;
      const applications = await getApplications(token);
      return applications;
    },
    enabled: !!token,
  });

  const { byStatus, appliedInLastWeek, filteredData } = useMemo(() => {
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

    const filteredData: Application[] = [];
    data.forEach((application: Application) => {
      if (
        application.companyName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        filteredData.push(application);
      } else if (
        application.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        filteredData.push(application);
      } else if (
        application.location.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        filteredData.push(application);
      }
    });

    if (sortBy === 'Oldest first') {
      filteredData.sort((a: Application, b: Application) => {
        if (a.createdAt == null || b.createdAt == null) return 0;
        if (a?.createdAt < b.createdAt) return -1;
        else if (a.createdAt > b.createdAt) return 1;
        else return 0;
      });
    } else if (sortBy === 'Newest first') {
      filteredData.sort((a: Application, b: Application) => {
        if (a.createdAt == null || b.createdAt == null) return 0;
        if (a.createdAt > b.createdAt) return -1;
        else if (a.createdAt < b.createdAt) return 1;
        else return 0;
      });
    } else if (sortBy === 'Company A-Z') {
      filteredData.sort((a: Application, b: Application) => {
        if (a.companyName == null || b.companyName == null) return 0;
        if (a.companyName < b.companyName) return -1;
        else if (a.companyName > b.companyName) return 1;
        else return 0;
      });
    }

    data.forEach((application: Application) => {
      if (!application.createdAt) return;
      if (application.applicationStatus === 'DRAFT') return;
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

    return { byStatus, appliedInLastWeek, filteredData };
  }, [data, searchQuery, sortBy]);

  return {
    data,
    isPending,
    byStatus,
    appliedInLastWeek,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredData,
  };
}
