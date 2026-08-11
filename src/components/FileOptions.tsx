import { EllipsisVertical, RotateCcw, ArrowDownToLine } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';

function FileOptions({
  onReplace,
  onDownload,
}: {
  onReplace: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDownload: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='relative'>
      <button
        className='border border-subtle-border rounded-xl p-3 hover:bg-[#ECE3D6]'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <EllipsisVertical />
      </button>
      <div
        className={`bg-[#FDFBF8] absolute left-15 -top-1 w-40 border border-subtle-border rounded-lg shadow-md transition-all duration-150 ease-out ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'}`}
      >
        <label
          className='w-full text-left px-4 py-2 hover:bg-[#ECE3D6] flex justify-between items-center'
          htmlFor='baseResumeUpload'
        >
          Replace
          <RotateCcw size={16} />
          <input
            type='file'
            className='hidden'
            id='baseResumeUpload'
            onChange={onReplace}
          />
        </label>
        <button
          className='w-full text-left px-4 py-2 hover:bg-[#ECE3D6] flex justify-between items-center'
          onClick={onDownload}
        >
          Download
          <ArrowDownToLine size={16} />
        </button>
      </div>
    </div>
  );
}

export default FileOptions;
