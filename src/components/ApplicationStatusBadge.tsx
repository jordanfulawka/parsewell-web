function ApplicationStatusBadge({ status }: { status: string | undefined }) {
  if (status === 'APPLIED') {
    return (
      <div className='bg-[#F0DFC5] text-[#8A5C2C] w-fit rounded-full text-sm font-bold py-2 px-4'>
        <span>Applied</span>
      </div>
    );
  } else if (status === 'HEARD_BACK') {
    return (
      <div className='bg-[#DDEBE0] text-[#345F3E] w-fit rounded-full text-sm font-bold py-2 px-3'>
        <span>Heard Back</span>
      </div>
    );
  } else if (status === 'REJECTED') {
    return (
      <div className='bg-[#E8C4B8] text-[#8A3B2E] w-fit rounded-full text-sm font-bold py-2 px-3'>
        <span>Rejected</span>
      </div>
    );
  } else if (status === 'GHOSTED') {
    return (
      <div className='bg-[#E3C6BE] text-[#8C4A3D] w-fit rounded-full text-sm font-bold py-2 px-3'>
        <span>Ghosted</span>
      </div>
    );
  } else if (status === 'DRAFT') {
    return (
      <div className='bg-[#E6DFD6] text-[#6E6157] w-fit rounded-full text-sm font-bold py-2 px-3'>
        <span>Draft</span>
      </div>
    );
  } else {
    <div className='bg-[#E9E5DE] text-[#7A6E64] w-fit rounded-full text-sm font-bold py-2 px-3'>
      <span>OTHER</span>
    </div>;
  }
}

export default ApplicationStatusBadge;
