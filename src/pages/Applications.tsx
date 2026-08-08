import { Plus, FileText } from 'lucide-react';
import { useEffect, useState, type ChangeEvent } from 'react';
import type { BaseResume } from '../lib/types';
import { getBaseResume, getPresignedPutUrl } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

function Applications() {
  const [baseResume, setBaseResume] = useState<BaseResume | null>(null);
  const [error, setError] = useState('');
  const [baseResumeFile, setBaseResumeFile] = useState<File | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    async function fetchBaseResume() {
      if (!token) return;
      try {
        const baseResume = await getBaseResume(token);
        setBaseResume(baseResume);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchBaseResume();
  }, [token]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!token) return;
    const presignedUrl = await getPresignedPutUrl(token);
    if (e.target.files) {
      setBaseResumeFile(e.target.files[0]);
      const file = e.target.files[0];
      fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
    }
  }

  return (
    <div className='h-full flex justify-center'>
      <div className='flex flex-col gap-10 h-fit w-150 m-10'>
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-3xl font-extrabold'>Applications</h1>
          <button className='flex gap-2 bg-[#7FA687] p-3 rounded-2xl text-white font-bold'>
            <Plus /> New Application
          </button>
        </div>
        {baseResume ? (
          <div className='bg-[#FDFBF8]'>base resume found</div>
        ) : (
          <div className='bg-[#FDFBF8] border border-subtle-border p-7 rounded-2xl flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div className='bg-[#DDEBE0] p-3 rounded-lg'>
                <FileText color='#345F3E' />
              </div>
              <span className='font-semibold'>No base resume found</span>
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
      </div>
    </div>
  );
}

export default Applications;
