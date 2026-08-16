import useApplications from '../hooks/useApplications';

function Insights() {
  const { data: applications, byStatus, appliedInLastWeek } = useApplications();

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col gap-10 w-120 m-10'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-extrabold'>Insights</h1>
          <p className='text-secondary-text'>
            A plain look at your application activity
          </p>
        </div>
        <div className='flex gap-8'>
          <div className='bg-[#FDFBF8] flex flex-col justify-around p-5 flex-1 border border-input-border rounded-xl h-30'>
            <p className='font-bold text-secondary-text text-sm'>
              Total applications
            </p>
            <span className='text-4xl font-extrabold'>
              {applications.length}
            </span>
          </div>
          <div className='bg-[#FDFBF8] flex flex-col justify-around p-5 flex-1 border border-input-border rounded-xl h-30'>
            <p className='font-bold text-secondary-text text-sm'>
              Applied in the past week
            </p>
            <span className='text-4xl font-extrabold'>
              {appliedInLastWeek.length}
            </span>
          </div>
        </div>
        <div className='bg-[#FDFBF8] border border-input-border rounded-xl h-55 p-6'>
          <p className='font-bold text-secondary-text text-sm mb-5'>
            By status
          </p>
          <div className='flex flex-col gap-2.5'>
            <div className='flex items-center'>
              <span className='text-sm font-bold text-[#8A5C2C] w-[25%]'>
                Applied
              </span>
              <div className='flex-1 bg-[#EBE3D7] rounded-full h-2 mr-5'>
                <div
                  className='flex-1 rounded-full h-2 mr-5 bg-[#8A5C2C] '
                  style={{
                    width: `${applications.length ? (byStatus['APPLIED'].length / applications.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{byStatus['APPLIED'].length}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-sm font-bold text-[#345F3E] w-[25%]'>
                Heard Back
              </span>
              <div className='flex-1 bg-[#EBE3D7] rounded-full h-2 mr-5'>
                <div
                  className='flex-1 rounded-full h-2 mr-5 bg-[#345F3E] '
                  style={{
                    width: `${applications.length ? (byStatus['HEARD_BACK'].length / applications.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{byStatus['HEARD_BACK'].length}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-sm font-bold text-[#8A3B2E] w-[25%]'>
                Rejected
              </span>
              <div className='flex-1 bg-[#EBE3D7] rounded-full h-2 mr-5'>
                <div
                  className='flex-1 rounded-full h-2 mr-5 bg-[#8A3B2E] '
                  style={{
                    width: `${applications.length ? (byStatus['REJECTED'].length / applications.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{byStatus['REJECTED'].length}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-sm font-bold text-[#8C4A3D] w-[25%]'>
                Ghosted
              </span>
              <div className='flex-1 bg-[#EBE3D7] rounded-full h-2 mr-5'>
                <div
                  className='flex-1 rounded-full h-2 mr-5 bg-[#8C4A3D] '
                  style={{
                    width: `${applications.length ? (byStatus['GHOSTED'].length / applications.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{byStatus['GHOSTED'].length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
