import { Plus, FileText, FileExclamationPoint } from 'lucide-react';
import { useEffect, useState, type ChangeEvent } from 'react';
import type { Application, BaseResume } from '../lib/types';
import {
  deleteBaseResume,
  getApplications,
  getBaseResume,
  getBaseResumePresignedGetUrl,
  getBaseResumePresignedPutUrl,
  uploadBaseResume,
} from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router';
import ApplicationItem from '../components/ApplicationItem';
import { parseDate } from '../lib/utils';
import FileOptions from '../components/FileOptions';

function Applications() {
  const [baseResume, setBaseResume] = useState<BaseResume | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showBaseResumeOptions, setShowBaseResumeOptions] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAuth();
  const navigate = useNavigate();

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

    async function fetchApplications() {
      if (!token) return;
      try {
        const response = await getApplications(token);
        console.log(response);
        setApplications(response);
      } catch (err) {
        console.log(err);
      }
    }
    fetchBaseResume();
    fetchApplications();
  }, [token]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!token) return;
    try {
      const presignedUrl = await getBaseResumePresignedPutUrl(token);
      if (e.target.files) {
        const file = e.target.files[0];
        await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });
        const baseResume = await uploadBaseResume(token, file.name);
        console.log(baseResume);
        setBaseResume(baseResume);
      }
    } catch (err: any) {
      setError(err.message);
      console.log(err);
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
      setError(err);
      console.log(err);
    }
  }

  return (
    <div className='bg-cream-primary h-full flex justify-center'>
      <div className='flex flex-col gap-10 h-fit w-170 m-10'>
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-3xl font-extrabold'>Applications</h1>
          <Link
            className='flex gap-2 bg-[#7FA687] p-3 rounded-2xl text-white font-bold cursor-pointer hover:bg-[#6D9476]'
            to='/applications/new'
          >
            <Plus /> New Application
          </Link>
        </div>
        {baseResume ? (
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
                    {parseDate(baseResume.createdAt, {
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
              {/* <label
                className='border border-subtle-border px-3 py-2.5 rounded-2xl hover:bg-[#ECE3D6]'
                htmlFor='baseResumeUpload'
              > */}
              <div>
                {/* <span className='font-semibold'>Replace</span> */}
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
                <FileExclamationPoint color='#8A5C2C' />
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
          {applications.map((application) => (
            <div
              onClick={() => navigate(`/applications/${application.id}`)}
              key={application.id}
            >
              <ApplicationItem application={application} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Applications;
