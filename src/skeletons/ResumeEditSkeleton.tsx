function ResumeEditSkeleton() {
  return (
    <div className='flex flex-col gap-5 mt-10'>
      <div className='bg-[#FDFBF8] border border-subtle-border rounded-xl p-5 flex flex-col gap-5 animate-pulse'>
        <div className='flex flex-col gap-2'>
          <div className='bg-[#E4DDD1] w-20 h-7 rounded-full text-sm font-bold py-1 px-3'></div>
          <div className='h-10 w-[90%] rounded bg-[#E4DDD1]' />
          <div className='h-20 w-[90%] rounded bg-[#E4DDD1]' />
          <div className='bg-tertiary-text/30 h-px' />
          <div className='h-10 w-[90%] rounded bg-[#E4DDD1]' />
        </div>
      </div>
      <div className='bg-[#FDFBF8] border border-subtle-border rounded-xl p-5 flex flex-col gap-5 animate-pulse'>
        <div className='flex flex-col gap-2'>
          <div className='bg-[#E4DDD1] w-20 h-7 rounded-full text-sm font-bold py-1 px-3'></div>
          <div className='h-10 w-[90%] rounded bg-[#E4DDD1]' />
          <div className='h-20 w-[90%] rounded bg-[#E4DDD1]' />
          <div className='bg-tertiary-text/30 h-px' />
          <div className='h-10 w-[90%] rounded bg-[#E4DDD1]' />
        </div>
      </div>
    </div>
  );
}

export default ResumeEditSkeleton;
