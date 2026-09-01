import {
  Plus,
  FileText,
  FileExclamationPoint,
  FileX,
  LoaderCircle,
  Search,
  ListSortDescending,
} from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import type { Application } from '../lib/types';
import {
  getBaseResume,
  getBaseResumePresignedGetUrl,
  getBaseResumePresignedPutUrl,
  uploadBaseResume,
} from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router';
import ApplicationItem from '../components/ApplicationItem';
import { getErrorMessage, parseDate } from '../lib/utils';
import FileOptions from '../components/FileOptions';
import ErrorBanner from '../components/ErrorBanner';
import BaseResumeSkeleton from '../skeletons/BaseResumeSkeleton';
import ApplicationItemSkeleton from '../skeletons/ApplicationItemSkeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useApplications from '../hooks/useApplications';
import StatusFilter from '../components/StatusFilter';

function Applications() {
  const [error, setError] = useState('');
  const [isBaseResumeUploading, setIsBaseResumeUploading] = useState(false);
  const [isSortByMenuOpen, setIsSortByMenuOpen] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: applications,
    isPending: isApplicationsPending,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredData,
    statusFilter,
    setStatusFilter,
    byStatus,
  } = useApplications();

  const { data: baseResume, isPending: isBaseResumePending } = useQuery({
    queryKey: ['baseResume', token],
    queryFn: async () => {
      if (!token) return;
      const baseResume = await getBaseResume(token);
      return baseResume;
    },
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: async (fileName: string) => {
      if (!token) return;
      const baseResume = await uploadBaseResume(token, fileName);
      return baseResume;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['baseResume', token], data);
    },
  });

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!token) return;
    try {
      setIsBaseResumeUploading(true);
      const presignedUrl = await getBaseResumePresignedPutUrl(token);
      if (e.target.files) {
        const file = e.target.files[0];
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload resume');
        await mutation.mutateAsync(file.name);
        setError('');
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to upload resume'));
    } finally {
      setIsBaseResumeUploading(false);
    }
  }

  async function handleDownload() {
    try {
      if (!token || !baseResume) return;
      const presignedUrl = await getBaseResumePresignedGetUrl(token);
      const response = await fetch(presignedUrl);
      if (!response.ok) throw new Error('Failed to download resume');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = baseResume.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to download resume'));
    }
  }

  return (
    // might need to change this overflow-x-hidden properly, could cause issues
    <div className='bg-cream-primary h-full flex justify-center overflow-x-hidden'>
      <div className='flex flex-col gap-10 h-fit w-170 m-10'>
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-3xl font-extrabold'>Applications</h1>
          {baseResume ? (
            <Link
              className='flex gap-2 bg-[#7FA687] p-3 rounded-2xl text-white font-bold cursor-pointer hover:bg-[#6D9476]'
              to='/applications/new'
            >
              <Plus /> New Application
            </Link>
          ) : (
            <div className='flex gap-2 bg-[#A9A9A9] p-3 rounded-2xl text-white font-bold cursor-not-allowed'>
              <Plus /> New Application
            </div>
          )}
        </div>
        <ErrorBanner message={error} onDismiss={() => setError('')} />
        {isBaseResumePending ? (
          <BaseResumeSkeleton />
        ) : isBaseResumeUploading ? (
          <div className='bg-[#FDFBF8] border border-subtle-border p-7 rounded-2xl flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div className='bg-[#F0DFC5] p-3 rounded-lg'>
                <FileExclamationPoint color='#8A5C2C' />
              </div>
              <span className='font-semibold text-secondary-text'>
                Uploading resume...
              </span>
              <span className='animate-spin'>
                <LoaderCircle size={16} color='#8a7c72' />
              </span>
            </div>
          </div>
        ) : baseResume ? (
          <div className='bg-[#FDFBF8] border border-subtle-border p-7 rounded-2xl flex justify-between items-center'>
            <div>
              <div className='flex items-center gap-2'>
                <div className='bg-[#DDEBE0] p-3 rounded-lg'>
                  <FileText color='#345F3E' />
                </div>
                <div className='flex flex-col '>
                  <span className='font-semibold'>
                    Resume successfully uploaded!
                  </span>
                  <span className='text-secondary-text text-sm'>
                    Uploaded{' '}
                    {parseDate(baseResume.updatedAt, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    ∙ {baseResume.fileName}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div>
                <FileOptions
                  onReplace={(e) => handleUpload(e)}
                  onDownload={handleDownload}
                  padding={3}
                  id='baseResumeUpload'
                />
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-[#FDFBF8] border border-subtle-border p-7 rounded-2xl flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div className='bg-[#F0DFC5] p-3 rounded-lg'>
                <FileX color='#8A3B2E' />
              </div>
              <span className='font-semibold'>Upload a resume to start</span>
            </div>
            <div>
              <label
                className='border border-subtle-border px-3 py-2.5 rounded-2xl hover:bg-[#ECE3D6]'
                htmlFor='baseResumeUpload'
              >
                <span className='font-semibold'>Upload</span>
                <input
                  type='file'
                  className='hidden'
                  id='baseResumeUpload'
                  onChange={handleUpload}
                />
              </label>
            </div>
          </div>
        )}
        <div className='flex flex-col gap-4'>
          <div>
            {applications.length > 0 && (
              <div className='flex-col'>
                <div className='flex justify-between gap-4 relative'>
                  <span className='absolute top-4 left-3'>
                    <Search size={16} />
                  </span>
                  <input
                    className='bg-[#FDFBF8] border border-input-border p-3 rounded-xl pl-10 flex-1'
                    placeholder='Search company, role, or location'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className='relative'>
                    <button
                      className='border border-input-border rounded-xl text-sm text-secondary-text font-bold px-5 py-3.5 flex items-center gap-2 hover:bg-[#ECE3D6]'
                      onClick={() => setIsSortByMenuOpen((prev) => !prev)}
                    >
                      <ListSortDescending size={16} />
                      {sortBy}
                    </button>
                    {isSortByMenuOpen && (
                      <div
                        className='absolute flex flex-col gap-1 top-15 right-0 bg-[#FDFBF8] shadow-lg w-50 rounded-xl text-primary-text p-2'
                        onClick={() => setIsSortByMenuOpen(false)}
                      >
                        <button
                          className={`p-3 text-left  rounded-xl ${sortBy === 'Recently updated' ? 'bg-[#DDEBE0]' : 'hover:bg-[#ECE3D6]'}`}
                          onClick={() => setSortBy('Recently updated')}
                        >
                          Recently updated
                        </button>
                        <button
                          className={`p-3 text-left  rounded-xl ${sortBy === 'Newest first' ? 'bg-[#DDEBE0]' : 'hover:bg-[#ECE3D6]'}`}
                          onClick={() => setSortBy('Newest first')}
                        >
                          Newest first
                        </button>
                        <button
                          className={`p-3 text-left  rounded-xl ${sortBy === 'Oldest first' ? 'bg-[#DDEBE0]' : 'hover:bg-[#ECE3D6]'}`}
                          onClick={() => setSortBy('Oldest first')}
                        >
                          Oldest first
                        </button>
                        <button
                          className={`p-3 text-left  rounded-xl ${sortBy === 'Company A-Z' ? 'bg-[#DDEBE0]' : 'hover:bg-[#ECE3D6]'}`}
                          onClick={() => setSortBy('Company A-Z')}
                        >
                          Company A-Z
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className='mt-3'>
                  <StatusFilter
                    selectedStatus={statusFilter}
                    setSelectedStatus={setStatusFilter}
                    byStatus={byStatus}
                  />
                </div>
              </div>
            )}
          </div>
          {isApplicationsPending ? (
            <ApplicationItemSkeleton />
          ) : !isApplicationsPending && applications.length == 0 ? (
            <div className='bg-[#FDFBF8] border border-input-border border-dashed p-4 rounded-xl'>
              <span className='text-primary-text font-bold'>
                Add an application to see it listed here!
              </span>
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((application: Application) => (
              <div
                onClick={() => navigate(`/applications/${application.id}`)}
                key={application.id}
              >
                <ApplicationItem application={application} />
              </div>
            ))
          ) : (
            <div className='bg-[#FDFBF8] border border-input-border border-dashed p-4 rounded-xl'>
              No applications fit these queries
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Applications;
