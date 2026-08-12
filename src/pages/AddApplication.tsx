import { useState } from 'react';
import { parseJobUrlAndGenerateDraftApplication } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import Loading from './Loading';
import { getErrorMessage } from '../lib/utils';
import ErrorBanner from '../components/ErrorBanner';

function AddApplication() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!token) return;
      setLoading(true);
      setError('');
      const response = await parseJobUrlAndGenerateDraftApplication(token, url);
      navigate(`/applications/review/${response.id}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to parse this job posting'));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading stage='parsingJobUrl' />;
  }

  return (
    <div className='h-full flex justify-center items-center'>
      <div className='bg-[#FDFBF8] border border-subtle-border p-10 rounded-2xl flex flex-col gap-6'>
        <div className='flex flex-col items-center gap-3'>
          <h2 className='text-2xl font-bold'>Add an application</h2>
          <p className='text-secondary-text'>
            Paste the job posting link and we'll pull in the details
          </p>
        </div>
        <ErrorBanner message={error} onDismiss={() => setError('')} />
        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='e.g. https://company.com/careers/job-id'
            className='bg-cream-primary border border-input-border p-3 w-full rounded-xl'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type='submit' className='bg-[#7FA687] p-3 rounded-xl w-full'>
            <span className='font-bold text-white'>Fetch details</span>
          </button>
        </form>
        <div className='flex items-center'>
          <div className='h-px bg-tertiary-text/30 w-full' />
          <span className='px-2 text-secondary-text'>or</span>
          <div className='h-px bg-tertiary-text/30 w-full' />
        </div>
        <button
          type='submit'
          className='border border-subtle-border p-3 rounded-xl w-full'
          onClick={() => navigate('/applications/review')}
        >
          <span className='font-bold '>Enter manually</span>
        </button>
      </div>
    </div>
  );
}

export default AddApplication;
