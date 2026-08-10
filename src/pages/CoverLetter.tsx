import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router';
import { getApplicationById, getCoverLetter } from '../lib/api';
import type { Application, CoverLetter } from '../lib/types';

function CoverLetter() {
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [application, setApplication] = useState<Application | null>(null);

  const { token } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

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

    fetchApplication();
    fetchCoverLetter();
  }, [token, params.id]);

  return (
    <div className='flex justify-center bg-cream-primary'>
      <div className=' p-10 flex flex-col gap-8 w-200'>
        <div className='flex flex-col'>
          <span className='text-2xl font-bold'>Cover Letter</span>
          <span className='text-secondary-text'>
            {application?.roleTitle} at {application?.companyName}
          </span>
        </div>
        <div className='bg-[#FDFBF8] p-10 border border-input-border rounded-2xl'>
          {coverLetter?.content}
        </div>
        <div>
          <button
            className='bg-[#7FA687] hover:bg-[#6D9476] text-[#FCFDFB] font-bold px-5 py-3 rounded-xl'
            onClick={() => navigate(`/applications/${params.id}`)}
          >
            Back to application
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoverLetter;
