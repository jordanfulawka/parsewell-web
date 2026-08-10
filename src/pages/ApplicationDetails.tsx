import { useEffect, useState, type ChangeEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router';
import {
  generateCoverLetter,
  getCoverLetter,
  getEditSuggestions,
  getFinalMaterialPresignedPutUrl,
  getFinalMaterials,
  uploadCoverLetter,
  uploadResume,
} from '../lib/api';
import { ChevronDown, Upload } from 'lucide-react';
import type { EditSuggestion } from '../lib/types';
import EditSuggestionItem from '../components/EditSuggestionItem';
import { parseDate } from '../lib/utils';
import useApplication from '../hooks/useApplication';

function ApplicationDetails() {
  const [editSuggestions, setEditSuggestions] = useState<EditSuggestion[]>([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [uploadedResume, setUploadedResume] = useState('');
  const [uploadedCoverLetter, setUploadedCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function fetchEditSuggestions() {
      try {
        if (!token) return;
        if (typeof params.id !== 'string') return;
        setLoading(true);
        const editSuggestions = await getEditSuggestions(token, params.id);
        setEditSuggestions(editSuggestions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        console.log(err);
        setLoading(false);
      }
    }

    async function fetchCoverLetter() {
      try {
        if (!token) return;
        if (typeof params.id !== 'string') return;
        const coverLetter = await getCoverLetter(token, params.id);
        console.log(coverLetter);
        setCoverLetter(coverLetter);
      } catch (err) {
        console.log(err);
      }
    }

    async function fetchFinalMaterials() {
      try {
        if (!token) return;
        if (typeof params.id !== 'string') return;
        const finalMaterials = await getFinalMaterials(token, params.id);
        console.log(finalMaterials);
        setUploadedCoverLetter(finalMaterials.coverLetterFilename);
        setUploadedResume(finalMaterials.resumeFilename);
      } catch (err) {
        console.log(err);
      }
    }

    fetchEditSuggestions();
    fetchCoverLetter();
    fetchFinalMaterials();
  }, [token, params.id]);

  async function handleCoverLetterGeneration() {
    try {
      if (!token) return;
      if (typeof params.id !== 'string') return;
      const coverLetter = await generateCoverLetter(token, params.id);
      console.log(coverLetter);
      navigate(`/applications/${params.id}/cover-letter`);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!token) return;
    if (typeof params.id !== 'string') return;
    if (e.target.files) {
      const file = e.target.files[0];
      if (e.target.id === 'coverLetterUpload') {
        const presignedUrl = await getFinalMaterialPresignedPutUrl(
          token,
          params.id,
          'coverLetter',
        );
        await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });
        const uploadedCoverLetter = await uploadCoverLetter(
          token,
          params.id,
          file.name,
        );
        setUploadedCoverLetter(uploadedCoverLetter.coverLetterFilename);
      } else if (e.target.id === 'resumeUpload') {
        const presignedUrl = await getFinalMaterialPresignedPutUrl(
          token,
          params.id,
          'resume',
        );
        await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });
        const uploadedResume = await uploadResume(token, params.id, file.name);
        setUploadedResume(uploadedResume.resumeFilename);
      }
    }
  }

  return (
    <div className='flex justify-center bg-cream-primary'>
      <div className=' p-10 flex flex-col gap-8 w-200'>
        <div className='bg-[#FDFBF8] border border-subtle-border rounded-xl p-5 flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>
            <div className='text-2xl font-bold'>{application?.companyName}</div>
            <div className=''>
              {application?.roleTitle}{' '}
              <span className='text-xs font-light'>•</span>{' '}
              {application?.location}
            </div>
            <div className='text-secondary-text'>
              Applied{' '}
              {application?.createdAt
                ? parseDate(application.createdAt, {
                    month: 'short',
                    day: 'numeric',
                  })
                : ''}
            </div>
          </div>
          <div className='flex gap-4'>
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
            </button>
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
          {showJobDescription && <p>{application?.jobDescription}</p>}
        </div>
        <div>
          <h2 className='text-xl font-bold'>Resume Edits</h2>
          <div className='flex flex-col gap-3'>
            {editSuggestions.map((editSuggestion: EditSuggestion) => (
              <EditSuggestionItem
                key={editSuggestion.id}
                editSuggestion={editSuggestion}
              />
            ))}
          </div>
        </div>
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
                <div className='flex items-center gap-2 font-bold text-sm text-tertiary-text'>
                  {uploadedResume}
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
                <div className='flex items-center gap-2 font-bold text-sm text-tertiary-text'>
                  {uploadedCoverLetter}
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
