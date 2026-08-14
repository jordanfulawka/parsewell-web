import { FileCode } from 'lucide-react';

function BaseResumeSkeleton() {
  return (
    <div className='bg-[#FDFBF8] border border-subtle-border p-7 rounded-2xl flex justify-between items-center animate-pulse'>
      <div className='flex items-center gap-2 w-full'>
        <div className='bg-[#E4DDD1] p-3 rounded-lg'>
          <FileCode color='#8a7c72' />
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <div className='h-3 w-48 bg-[#E4DDD1] rounded-full' />
          <div className='h-6 w-[50%] bg-[#E4DDD1] rounded-full' />
        </div>
      </div>
    </div>
  );
}

export default BaseResumeSkeleton;
