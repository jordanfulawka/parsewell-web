import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { generateResumeEdits, getApplicationById } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

function ApplicationDetails() {
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    async function fetchApplication() {
      try {
        if (!token) return;
        if (typeof params.id !== 'string') return;
        setLoading(true);
        const { companyName, roleTitle, location, jobDescription } =
          await getApplicationById(token, params.id);
        setCompanyName(companyName);
        setRoleTitle(roleTitle);
        setLocation(location);
        setJobDescription(jobDescription);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        console.log(err);
        setLoading(false);
      }
    }
    if (params.id) {
      fetchApplication();
    }
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log('hi!');
    console.log(params.id);
    console.log(token);
    console.log(typeof params.id);
    try {
      if (!token) return;
      if (typeof params.id !== 'string') return;
      setLoading(true);
      const response = await generateResumeEdits(token, params.id);
      console.log(response);
      setLoading(false);
      navigate(`/applications/${params.id}`);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  if (loading) {
    return <div>loading!</div>;
  }

  return (
    <div className='p-10 flex justify-center'>
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
              Put the job information here. Double check befor submission
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
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
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

export default ApplicationDetails;

// http://localhost:5173/applications/details/ea75cab5-daae-4e42-987f-fee206e16bc9
