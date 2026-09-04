import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../lib/utils';
import {
  getFinalMaterialPresignedGetUrl,
  getFinalMaterialPresignedPutUrl,
  getFinalMaterials,
  uploadCoverLetter,
  uploadResume,
} from '../lib/api';
import { Upload } from 'lucide-react';
import FileOptions from './FileOptions';
import ErrorBanner from './ErrorBanner';

function FileUploader({ onResumeUpload }: { onResumeUpload: () => void }) {
  const [uploadedResume, setUploadedResume] = useState('');
  const [uploadedCoverLetter, setUploadedCoverLetter] = useState('');
  const [isDraggingResume, setIsDraggingResume] = useState(false);
  const [isDraggingCoverLetter, setIsDraggingCoverletter] = useState(false);
  const dragCounterResume = useRef(0);
  const dragCounterCoverLetter = useRef(0);
  const [error, setError] = useState('');

  const { token } = useAuth();
  const params = useParams();

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

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!token) return;
    if (typeof params.id !== 'string') return;
    try {
      if (e.target.files) {
        const file = e.target.files[0];
        if (file.type !== 'application/pdf') {
          setError('Only PDF files are supported');
          return;
        }
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
          onResumeUpload();
          setError('');
        }
      }
    } catch (err) {
      setError(getErrorMessage(err, 'There was an error uploading this file'));
    }
  }

  async function handleUploadForDroppedFile(
    e: React.DragEvent<HTMLDivElement>,
  ) {
    e.preventDefault();
    if (!token) return;
    if (typeof params.id !== 'string') return;
    try {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (e.currentTarget.id === 'resumeUploadDrop') {
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
        const uploadedResume = await uploadResume(token, params.id, file.name);
        setUploadedResume(uploadedResume.resumeFilename);
        setError('');
      } else if (e.currentTarget.id === 'coverLetterUploadDrop') {
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

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    dragCounterCoverLetter.current = 0;
    dragCounterResume.current = 0;
    setIsDraggingCoverletter(false);
    setIsDraggingResume(false);
    const file = e.dataTransfer.files[0];
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported');
      return;
    }
    handleUploadForDroppedFile(e);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  return (
    <div className='flex gap-5 mt-2'>
      {error && <ErrorBanner message={error} />}
      <div
        className={`flex-1 border-2 p-5 flex flex-col gap-3 rounded-xl transition-colors duration-150 ${isDraggingResume ? 'bg-[#F5EAD8] border-[#C9A66B] border-solid' : 'bg-[#FDFBF8] border-subtle-border border-dashed'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={(e) => {
          e.preventDefault();
          dragCounterResume.current += 1;
          setIsDraggingResume(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          dragCounterResume.current -= 1;
          if (dragCounterResume.current <= 0) {
            dragCounterResume.current = 0;
            setIsDraggingResume(false);
          }
        }}
        id='resumeUploadDrop'
      >
        <span className='text-primary-text font-bold text-sm'>Resume Sent</span>
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
      <div
        className={`flex-1 border-2 p-5 flex flex-col gap-3 rounded-xl transition-colors duration-150 ${isDraggingCoverLetter ? 'bg-[#F5EAD8] border-[#C9A66B] border-solid' : 'bg-[#FDFBF8] border-subtle-border border-dashed'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={(e) => {
          e.preventDefault();
          dragCounterCoverLetter.current += 1;
          setIsDraggingCoverletter(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          dragCounterCoverLetter.current -= 1;
          if (dragCounterCoverLetter.current <= 0) {
            dragCounterCoverLetter.current = 0;
            setIsDraggingCoverletter(false);
          }
        }}
        id='coverLetterUploadDrop'
      >
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
  );
}

export default FileUploader;
