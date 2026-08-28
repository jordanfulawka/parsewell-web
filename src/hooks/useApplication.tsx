import type { Application } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router';
import { getApplicationById, updateApplication } from '../lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function useApplication() {
  const { token } = useAuth();
  const params = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!params.id) {
      queryClient.removeQueries({
        queryKey: ['application', params.id, token],
        exact: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['application', params.id, token],
    queryFn: async () => {
      if (!token) return;
      if (!params.id) return;
      const application = await getApplicationById(token, params.id);
      return application;
    },
    enabled: !!token && typeof params.id === 'string',
  });

  const mutation = useMutation({
    mutationFn: async (updated: Application) => {
      if (!token) return updated;
      // no id yet means this application hasn't been created on the
      // server, so just keep the edit local until the form is submitted
      if (!params.id) return updated;
      return await updateApplication(token, updated);
    },

    onMutate: async (newApplication) => {
      await queryClient.cancelQueries({
        queryKey: ['application', params.id, token],
      });
      const previousApplication = queryClient.getQueryData([
        'application',
        params.id,
        token,
      ]);
      queryClient.setQueryData(
        ['application', params.id, token],
        newApplication,
      );
      return { previousApplication, newApplication };
    },
    onError: (_err, _newApplication, context) => {
      queryClient.setQueryData(
        ['application', params.id, token],
        context?.previousApplication,
      );
    },
    onSettled: (newApplication) => {
      if (!newApplication) return;
      queryClient.invalidateQueries({
        queryKey: ['application', newApplication.id],
      });
    },
  });

  // if user enters job manually
  const emptyJob = {
    companyName: '',
    roleTitle: '',
    location: '',
    jobURL: '',
    jobDescription: '',
  };

  const application = data ?? emptyJob;
  const isLoading = params.id ? isPending : false;

  function updateStatus(status: string) {
    if (!application) return;
    mutation.mutate({ ...application, applicationStatus: status });
  }

  return { application, isLoading, isError, error, mutation, updateStatus };
}
