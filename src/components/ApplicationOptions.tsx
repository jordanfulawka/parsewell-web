import { EllipsisVertical, Trash2, FileText, FileDiff } from 'lucide-react';
import { useState } from 'react';
import GenericModal from './GenericModal';

function ApplicationOptions({
  handleDelete,
  handleCoverLetterRegen,
  handleResumeRegen,
}: {
  handleDelete: () => void;
  handleCoverLetterRegen: () => void;
  handleResumeRegen: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className='relative'>
        <button
          className='border border-subtle-border rounded-xl flex items-center p-1 hover:bg-[#ECE3D6]'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <EllipsisVertical />
        </button>
        <div
          className={`bg-[#FDFBF8] absolute right-0 top-10 w-60 border border-subtle-border shadow-md rounded-lg transition-all duration-150 ease-out text-sm text-primary-text ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'}`}
        >
          <button
            className='w-full text-left px-4 py-2 hover:bg-[#ECE3D6] flex justify-between items-center'
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
            <Trash2 />
          </button>
          <button
            className='w-full text-left px-4 py-2 hover:bg-[#ECE3D6] flex justify-between items-center'
            onClick={handleCoverLetterRegen}
          >
            Re-generate cover letter
            <FileText />
          </button>
          <button
            className='w-full text-left px-4 py-2 hover:bg-[#ECE3D6] flex justify-between items-center'
            onClick={handleResumeRegen}
          >
            Re-generate resume edits
            <FileDiff />
          </button>
        </div>
      </div>
      {showDeleteModal && (
        <GenericModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          dialogText='Are you sure you want to delete this application?'
          cancelText='No, go back!'
          confirmText='Yes, delete'
        />
      )}
    </>
  );
}

export default ApplicationOptions;
