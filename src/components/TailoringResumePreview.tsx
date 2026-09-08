function TailoringResumePreview() {
  return (
    <div className='border border-white/30 rounded-lg'>
      <div className='bg-white/10 p-3'>
        <p className='text-[#f0f7f0]/60 uppercase text-sm font-bold tracking-wide mb-2'>
          Tailoring Resume
        </p>
        <div className='flex flex-col gap-2'>
          <div className='h-2 w-50 bg-[#f0f7f0]/40 rounded-full animate-slide1' />
          <div className='h-2 w-30 bg-[#f0f7f0]/40 rounded-full animate-slide2' />
          <div className='h-2 w-40 bg-[#f0f7f0]/40 rounded-full animate-slide3' />
        </div>
      </div>
    </div>
  );
}

export default TailoringResumePreview;
