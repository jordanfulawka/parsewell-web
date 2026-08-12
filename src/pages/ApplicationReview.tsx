import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {
  createApplication,
  createApplicationRequest,
  generateResumeEdits,
  updateApplication,
} from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import useApplication from '../hooks/useApplication';
import { getRandomMessage } from '../lib/loadingMessages';
import Loading from './Loading';

function ApplicationReview() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchParams] = useSearchParams();

  const {
    application,
    isLoading: applicationIsLoading,
    error: applicationError,
    setApplication,
  } = useApplication();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (!token) return;
      if (!application) return;
      setLoading(true);
      let returnedApplication;
      if (params.id) {
        console.log(application);
        returnedApplication = await updateApplication(token, application);
      } else {
        const applicationRequest = await createApplicationRequest(
          token,
          application,
        );
        console.log(applicationRequest);
        returnedApplication = await createApplication(
          token,
          applicationRequest,
        );
      }
      const response = await generateResumeEdits(token, returnedApplication.id);
      console.log(response);
      setLoading(false);
      navigate(`/applications/${returnedApplication.id}`);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  if (loading) {
    return <Loading stage='generatingResumeEdits' />;
  }

  return (
    <div className='bg-cream-primary p-10 flex justify-center'>
      <div className='w-150 flex flex-col gap-10'>
        {params.id ? (
          <div className='flex flex-col gap-1'>
            <h2 className='text-2xl font-bold'>Review the details</h2>
            <p className='text-secondary-text'>
              We pulled this from the posting. Double check before continuing
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-1'>
            <h2 className='text-2xl font-bold'>Enter the details</h2>
            <p className='text-secondary-text'>
              {searchParams.get('error') ? (
                <span className='text-red-800'>
                  Unable to fetch job posting information. Please enter manually
                </span>
              ) : (
                'Please enter posting information here.'
              )}
            </p>
          </div>
        )}
        <form className='w-full flex flex-col gap-5' onSubmit={handleSubmit}>
          <div>
            <label className='font-bold text-primary-text text-sm'>
              Company Name
            </label>
            <input
              type='text'
              placeholder='e.g. Scotiabank, Google, Stripe'
              className='bg-[#FDFBF8] border border-input-border p-3 rounded-xl w-full mt-2'
              value={application?.companyName}
              onChange={(e) => {
                if (!application) return;
                setApplication({ ...application, companyName: e.target.value });
              }}
              required
            />
          </div>
          <div>
            <label className='font-bold text-primary-text text-sm'>
              Role Title
            </label>
            <input
              type='text'
              placeholder='e.g. Full Stack Engineer, Data Engineer, Embedded Software Developer'
              className='bg-[#FDFBF8] border border-input-border p-3 rounded-xl w-full mt-2'
              value={application?.roleTitle}
              onChange={(e) => {
                if (!application) return;
                setApplication({ ...application, roleTitle: e.target.value });
              }}
              required
            />
          </div>
          <div>
            <label className='font-bold text-primary-text text-sm'>
              Location
            </label>
            <input
              type='text'
              placeholder='e.g. Toronto, San Francisco, Remote (US)'
              className='bg-[#FDFBF8] border border-input-border p-3 rounded-xl w-full mt-2'
              value={application?.location}
              onChange={(e) => {
                if (!application) return;
                setApplication({ ...application, location: e.target.value });
              }}
              required
            />
          </div>
          <div>
            <label className='font-bold text-primary-text text-sm'>
              Job Description
            </label>
            <textarea
              placeholder='Paste the full job description here...'
              rows={7}
              className='bg-[#FDFBF8] border border-input-border p-3 rounded-xl w-full mt-2'
              value={application?.jobDescription}
              onChange={(e) => {
                if (!application) return;
                setApplication({
                  ...application,
                  jobDescription: e.target.value,
                });
              }}
              required
            ></textarea>
          </div>
          <div>
            <button
              type='submit'
              className='bg-[#7FA687] p-3 rounded-xl w-full hover:bg-[#6D9476]'
            >
              <span className='font-bold text-white'>
                Save & Generate Edits
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationReview;

// http://localhost:5173/applications/review/ea75cab5-daae-4e42-987f-fee206e16bc9
