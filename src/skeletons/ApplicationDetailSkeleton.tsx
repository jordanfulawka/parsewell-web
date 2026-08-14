function ApplicationSkeleton() {
  return (
    <div className='bg-[#FDFBF8] border border-subtle-border rounded-xl p-5 flex flex-col gap-5 animate-pulse'>
      <div className='flex flex-col gap-2'>
        <div className='h-7 w-56 rounded bg-[#E4DDD1]' />
        <div className='h-4 w-72 rounded bg-[#E4DDD1]' />
        <div className='h-4 w-40 rounded bg-[#E4DDD1]' />
      </div>
      <div className='flex gap-4'>
        <div className='h-9 w-24 rounded-full bg-[#E4DDD1]' />
        <div className='h-9 w-28 rounded-full bg-[#E4DDD1]' />
        <div className='h-9 w-24 rounded-full bg-[#E4DDD1]' />
        <div className='h-9 w-24 rounded-full bg-[#E4DDD1]' />
      </div>
      <div className='bg-tertiary-text/30 h-px' />
      <div className='h-5 w-36 rounded bg-[#E4DDD1]' />
    </div>
  );
}

export default ApplicationSkeleton;
