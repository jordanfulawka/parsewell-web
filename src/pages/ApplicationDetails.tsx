import { useEffect, useState, type ChangeEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router';
import {
  deleteApplicationById,
  generateCoverLetter,
  getFinalMaterialPresignedGetUrl,
  getFinalMaterialPresignedPutUrl,
  getFinalMaterials,
  uploadCoverLetter,
  uploadResume,
} from '../lib/api';
import { ChevronDown, Upload, ExternalLink, ArrowBigLeft } from 'lucide-react';
import type { EditSuggestion } from '../lib/types';
import EditSuggestionItem from '../components/EditSuggestionItem';
import { parseDate } from '../lib/utils';
import useApplication from '../hooks/useApplication';
import FileOptions from '../components/FileOptions';
import ErrorBanner from '../components/ErrorBanner';
import { getErrorMessage } from '../lib/utils';
import ApplicationDetailSkeleton from '../skeletons/ApplicationDetailSkeleton';
import ResumeEditSkeleton from '../skeletons/ResumeEditSkeleton';
import Loading from './Loading';
import useEditSuggestions from '../hooks/useEditSuggestions';
import useCoverLetter from '../hooks/useCoverLetter';
import ApplicationOptions from '../components/ApplicationOptions';

function ApplicationDetails() {
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [uploadedResume, setUploadedResume] = useState('');
  const [uploadedCoverLetter, setUploadedCoverLetter] = useState('');
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const {
    application,
    isLoading: applicationIsLoading,
    error: applicationError,
    updateStatus,
  } = useApplication();

  const {
    data: editSuggestions,
    isPending: editSuggestionsIsLoading,
    error: editSuggestionsError,
  } = useEditSuggestions();

  const { data: coverLetter } = useCoverLetter();

  useEffect(() => {
    async function fetchFinalMaterials() {
      try {
        if (!token) return;
        if (typeof params.id !== 'string') return;
        const finalMaterials = await getFinalMaterials(token, params.id);
        setUploadedCoverLetter(finalMaterials.coverLetterFilename);
        setUploadedResume(finalMaterials.resumeFilename);
      } catch {
        // no submitted materials yet — not an error state
      }
    }

    fetchFinalMaterials();
  }, [token, params.id]);

  async function handleCoverLetterGeneration() {
    try {
      if (!token) return;
      if (typeof params.id !== 'string') return;
      setCoverLetterLoading(true);
      await generateCoverLetter(token, params.id);
      navigate(`/applications/${params.id}/cover-letter`);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to generate cover letter'));
    } finally {
      setCoverLetterLoading(false);
    }
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!token) return;
    if (typeof params.id !== 'string') return;
    try {
      if (e.target.files) {
        const file = e.target.files[0];
        if (e.target.id === 'coverLetterUpload') {
          const presignedUrl = await getFinalMaterialPresignedPutUrl(
            token,
            params.id,
            'coverLetter',
          );
          const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          });
          if (!uploadResponse.ok)
            throw new Error('Failed to upload cover letter');
          const uploadedCoverLetter = await uploadCoverLetter(
            token,
            params.id,
            file.name,
          );
          setUploadedCoverLetter(uploadedCoverLetter.coverLetterFilename);
          setError('');
        } else if (e.target.id === 'resumeUpload') {
          const presignedUrl = await getFinalMaterialPresignedPutUrl(
            token,
            params.id,
            'resume',
          );
          const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          });
          if (!uploadResponse.ok) throw new Error('Failed to upload resume');
          const uploadedResume = await uploadResume(
            token,
            params.id,
            file.name,
          );
          setUploadedResume(uploadedResume.resumeFilename);
          setError('');
        }
      }
    } catch (err) {
      setError(getErrorMessage(err, 'There was an error uploading this file'));
    }
  }

  async function handleDownload(type: string) {
    try {
      if (!token || typeof params.id !== 'string') return;
      const presignedUrl = await getFinalMaterialPresignedGetUrl(
        token,
        params.id,
        type,
      );
      const response = await fetch(presignedUrl);
      if (!response.ok) throw new Error(`Failed to download ${type}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'resume' ? uploadedResume : uploadedCoverLetter;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        getErrorMessage(err, 'There was an issue downloading this file'),
      );
    }
  }

  async function handleApplicationDelete() {
    try {
      if (!token) return;
      if (typeof params.id !== 'string') return;
      await deleteApplicationById(token, params.id);
    } catch (err) {
      setError(getErrorMessage(err, 'Error deleting application'));
    } finally {
      navigate(`/applications`);
    }
  }

  if (coverLetterLoading) {
    return <Loading stage='generatingCoverLetter' />;
  }

  console.log(application);

  return (
    <div className='flex justify-center bg-cream-primary overflow-x-hidden'>
      <div className=' p-10 flex flex-col gap-8 w-200'>
        <ErrorBanner
          message={
            applicationError?.message || editSuggestionsError?.message || error
          }
          onDismiss={() => setError('')}
        />
        {applicationIsLoading ? (
          <ApplicationDetailSkeleton />
        ) : (
          <div className='bg-[#FDFBF8] border border-subtle-border rounded-xl p-5 flex flex-col gap-5 relative'>
            <button
              className='absolute w-15 h-15 top-0 -left-20 border border-subtle-border flex justify-center items-center rounded-xl bg-[#FDFBF8] hover:border-tertiary-text'
              onClick={() => navigate('/applications')}
            >
              <ArrowBigLeft />
            </button>
            <div className='flex flex-col gap-2'>
              <div className='text-2xl font-bold flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  {application?.companyName}{' '}
                  {application?.jobURL && (
                    <a href={application.jobURL} target='_blank'>
                      <ExternalLink color='#7FA697' />
                    </a>
                  )}
                </div>
                <ApplicationOptions handleDelete={handleApplicationDelete} />
              </div>
              <div className=''>
                {application?.roleTitle}{' '}
                <span className='text-xs font-light'>•</span>{' '}
                {application?.location}
              </div>
              <div className='text-secondary-text'>
                Created{' '}
                {application?.createdAt
                  ? parseDate(application.createdAt, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''}
              </div>
            </div>
            <div className='flex gap-4'>
              {application.applicationStatus === 'DRAFT' ? (
                <>
                  <div className='bg-[#E6DFD6] text-[#6E6157] w-fit rounded-full text-sm font-bold py-2 px-4 border border-subtle-border '>
                    Draft
                  </div>
                  <button
                    className='bg-[#DDEBE0] text-[#345F3E] border border-[#345F3E] border-dashed w-fit rounded-full text-sm font-bold py-2 px-4 animate-pulse cursor-pointer'
                    onClick={() => {
                      if (!application) return;
                      updateStatus('APPLIED');
                    }}
                  >
                    Mark as applied
                  </button>
                </>
              ) : (
                <>
                  {' '}
                  <button
                    className={`border px-4 py-2 rounded-full flex justify-center items-center font-bold cursor-pointer ${application?.applicationStatus === 'APPLIED' ? 'bg-[#F0DFC5] text-[#8A5C2C] border-[#8A5C2C]' : 'text-secondary-text border-subtle-border'}`}
                    onClick={() => {
                      if (!application) return;
                      updateStatus('APPLIED');
                    }}
                  >
                    <span className='text-sm'>Applied</span>
                  </button>
                  <button
                    className={`border px-4 py-2 rounded-full flex justify-center items-center font-bold cursor-pointer ${application?.applicationStatus === 'HEARD_BACK' ? 'bg-[#DDEBE0] text-[#345F3E] border-[#345F3E]' : 'text-secondary-text border-subtle-border'}`}
                    onClick={() => {
                      if (!application) return;
                      updateStatus('HEARD_BACK');
                    }}
                  >
                    <span className='text-sm'>Heard Back</span>
                  </button>
                  <button
                    className={`border px-4 py-2 rounded-full flex justify-center items-center font-bold cursor-pointer ${application?.applicationStatus === 'REJECTED' ? 'bg-[#E8C4B8] text-[#8A3B2E] border-[#8A3B2E]' : 'text-secondary-text border-subtle-border'}`}
                    onClick={() => {
                      if (!application) return;
                      updateStatus('REJECTED');
                    }}
                  >
                    <span className='text-sm'>Rejected</span>
                  </button>
                  <button
                    className={`border px-4 py-2 rounded-full flex justify-center items-center font-bold cursor-pointer ${application?.applicationStatus === 'GHOSTED' ? 'bg-[#E3C6BE] text-[#8C4A3D] border-[#8C4A3D]' : 'text-secondary-text border-subtle-border'}`}
                    onClick={() => {
                      if (!application) return;
                      updateStatus('GHOSTED');
                    }}
                  >
                    <span className='text-sm'>Ghosted</span>
                  </button>{' '}
                </>
              )}
            </div>
            <div className='bg-tertiary-text/30 h-px' />
            <div className='flex items-center gap-2'>
              <h4 className='font-bold text-primary-text'>Job description</h4>
              <button
                className={`${showJobDescription ? '' : 'rotate-180'} transition-transform`}
                onClick={() => setShowJobDescription((prev) => !prev)}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            {showJobDescription && (
              <p className='whitespace-pre-wrap'>
                {application?.jobDescription}
              </p>
            )}
          </div>
        )}
        {editSuggestionsIsLoading ? (
          <ResumeEditSkeleton />
        ) : (
          <div>
            {editSuggestions.length > 0 && (
              <h2 className='text-xl font-bold'>Resume Edits</h2>
            )}
            <div className='flex flex-col gap-3'>
              {editSuggestions.map((editSuggestion: EditSuggestion) => (
                <EditSuggestionItem
                  key={editSuggestion.id}
                  editSuggestion={editSuggestion}
                />
              ))}
            </div>
          </div>
        )}
        <div>
          {coverLetter ? (
            <button
              className='text-[#8A5A3E] px-6 py-3 rounded-xl font-bold border border-[#DDB8A0]'
              onClick={() =>
                navigate(`/applications/${params.id}/cover-letter`)
              }
            >
              Show cover letter
            </button>
          ) : (
            <button
              className='bg-[#BC7F53] text-[#FDFAF7] px-6 py-3 rounded-xl font-bold'
              onClick={handleCoverLetterGeneration}
            >
              Generate cover letter
            </button>
          )}
        </div>
        <div>
          <h3 className='text-xl font-bold'>Submitted Materials</h3>
          <p className='text-secondary-text'>
            Attach the files you applied with, so you always know which version
            went out.
          </p>
          <div className='flex gap-5 mt-2'>
            <div className='flex-1 bg-[#FDFBF8] border border-subtle-border border-dashed p-5 flex flex-col gap-3 rounded-xl'>
              <span className='text-primary-text font-bold text-sm'>
                Resume Sent
              </span>
              {uploadedResume ? (
                <div className='flex items-center justify-between gap-2 font-bold text-sm text-tertiary-text'>
                  <div>{uploadedResume}</div>
                  <FileOptions
                    padding={1}
                    onReplace={handleUpload}
                    onDownload={() => handleDownload('resume')}
                    id='resumeUpload'
                  />
                </div>
              ) : (
                <label
                  className='flex items-center gap-2 font-bold text-sm text-tertiary-text cursor-pointer'
                  htmlFor='resumeUpload'
                >
                  <Upload size={16} /> Attach resume
                  <input
                    type='file'
                    className='hidden'
                    id='resumeUpload'
                    onChange={handleUpload}
                  />
                </label>
              )}
            </div>
            <div className='flex-1 bg-[#FDFBF8] border border-subtle-border border-dashed p-5 flex flex-col gap-3 rounded-xl'>
              <span className='text-primary-text font-bold text-sm'>
                Cover letter sent
              </span>
              {uploadedCoverLetter ? (
                <div className='flex items-center justify-between gap-2 font-bold text-sm text-tertiary-text'>
                  <div>{uploadedCoverLetter}</div>
                  <FileOptions
                    padding={1}
                    onReplace={(e) => handleUpload(e)}
                    onDownload={() => handleDownload('coverLetter')}
                    id='coverLetterUpload'
                  />
                </div>
              ) : (
                <label
                  className='flex items-center gap-2 font-bold text-sm text-tertiary-text cursor-pointer'
                  htmlFor='coverLetterUpload'
                >
                  <Upload size={16} /> Attach cover letter
                  <input
                    type='file'
                    className='hidden'
                    id='coverLetterUpload'
                    onChange={handleUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetails;

// http://localhost:5173/applications/0eebc467-fa6d-498d-a986-8b6228da914f

// https://jobs.ashbyhq.com/relayfi/c412e8d5-d7fc-4dde-b905-e3e4ceb03c08
