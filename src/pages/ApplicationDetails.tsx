import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router';
import {
  getApplicationById,
  getEditSuggestions,
  updateApplication,
} from '../lib/api';
import { ChevronDown } from 'lucide-react';
import type { Application, EditSuggestion } from '../lib/types';
import EditSuggestionItem from '../components/EditSuggestionItem';

function parseDate(raw: string) {
  const truncated = raw.replace(/(\.\d{3})\d+$/, '$1');

  return new Date(truncated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function ApplicationDetails() {
  const [application, setApplication] = useState<Application>();
  const [editSuggestions, setEditSuggestions] = useState<EditSuggestion[]>([]);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { token } = useAuth();
  const params = useParams();

  useEffect(() => {
    async function fetchApplication() {
      try {
        if (!token) return;
        if (typeof params.id !== 'string') return;
        const application = await getApplicationById(token, params.id);
        setApplication(application);
      } catch (err) {
        console.log(err);
      }
    }

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
    fetchApplication();
    fetchEditSuggestions();
  }, [token, params.id]);

  async function updateStatus() {
    try {
      if (!token) return;
      if (!application) return;
      await updateApplication(token, application);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    updateStatus();
  }, [application?.applicationStatus]);

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
              {application?.createdAt ? parseDate(application.createdAt) : ''}
            </div>
          </div>
          <div className='flex gap-4'>
            <button
              className={`border px-4 py-2 rounded-full flex justify-center items-center font-bold cursor-pointer ${application?.applicationStatus === 'APPLIED' ? 'bg-[#F0DFC5] text-[#8A5C2C] border-[#8A5C2C]' : 'text-secondary-text border-subtle-border'}`}
              onClick={() => {
                if (!application) return;
                setApplication({
                  ...application,
                  applicationStatus: 'APPLIED',
                });
              }}
            >
              <span className='text-sm'>Applied</span>
            </button>
            <button
              className={`border px-4 py-2 rounded-full flex justify-center items-center font-bold cursor-pointer ${application?.applicationStatus === 'HEARD_BACK' ? 'bg-[#DDEBE0] text-[#345F3E] border-[#345F3E]' : 'text-secondary-text border-subtle-border'}`}
              onClick={() => {
                if (!application) return;
                setApplication({
                  ...application,
                  applicationStatus: 'HEARD_BACK',
                });
              }}
            >
              <span className='text-sm'>Heard Back</span>
            </button>
            <button
              className={`border px-4 py-2 rounded-full flex justify-center items-center font-bold cursor-pointer ${application?.applicationStatus === 'REJECTED' ? 'bg-[#E8C4B8] text-[#8A3B2E] border-[#8A3B2E]' : 'text-secondary-text border-subtle-border'}`}
              onClick={() => {
                if (!application) return;
                setApplication({
                  ...application,
                  applicationStatus: 'REJECTED',
                });
              }}
            >
              <span className='text-sm'>Rejected</span>
            </button>
            <button
              className={`border px-4 py-2 rounded-full flex justify-center items-center font-bold cursor-pointer ${application?.applicationStatus === 'GHOSTED' ? 'bg-[#E3C6BE] text-[#8C4A3D] border-[#8C4A3D]' : 'text-secondary-text border-subtle-border'}`}
              onClick={() => {
                if (!application) return;
                setApplication({
                  ...application,
                  applicationStatus: 'GHOSTED',
                });
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
      </div>
    </div>
  );
}

export default ApplicationDetails;

// http://localhost:5173/applications/0eebc467-fa6d-498d-a986-8b6228da914f

// https://jobs.ashbyhq.com/relayfi/c412e8d5-d7fc-4dde-b905-e3e4ceb03c08
