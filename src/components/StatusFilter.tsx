import type { Application, ApplicationStatus } from '../lib/types';

function StatusFilter({
  selectedStatus,
  setSelectedStatus,
  byStatus,
}: {
  selectedStatus: ApplicationStatus[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedStatus: (status: any) => void;
  byStatus: {
    APPLIED: Application[];
    HEARD_BACK: Application[];
    REJECTED: Application[];
    GHOSTED: Application[];
    OTHER: Application[];
  };
}) {
  function toggleStatus(toggledStatus: ApplicationStatus) {
    if (!selectedStatus.includes(toggledStatus)) {
      setSelectedStatus((prev: ApplicationStatus[]) => [
        ...prev,
        toggledStatus,
      ]);
    } else {
      setSelectedStatus((prev: ApplicationStatus[]) =>
        prev.filter((status: ApplicationStatus) => toggledStatus !== status),
      );
    }
  }

  return (
    <div className='flex gap-4'>
      <div
        className={`${selectedStatus.includes('APPLIED') ? 'bg-[#F0DFC5] text-[#8A5C2C]' : 'border border-input-border text-tertiary-text'} w-fit rounded-full text-sm font-bold py-2 px-4 cursor-pointer`}
        onClick={() => toggleStatus('APPLIED')}
      >
        <span className='unselectable'>Applied </span>
        <span className='unselectable'>∙ {byStatus['APPLIED'].length}</span>
      </div>
      <div
        className={`${selectedStatus.includes('HEARD_BACK') ? 'bg-[#DDEBE0] text-[#345F3E]' : 'border border-input-border text-tertiary-text'} w-fit rounded-full text-sm font-bold py-2 px-4 cursor-pointer`}
        onClick={() => toggleStatus('HEARD_BACK')}
      >
        <span className='unselectable'>Heard Back </span>
        <span className='unselectable'>∙ {byStatus['HEARD_BACK'].length}</span>
      </div>
      <div
        className={`${selectedStatus.includes('REJECTED') ? 'bg-[#E8C4B8] text-[#8A3B2E]' : 'border border-input-border text-tertiary-text'} w-fit rounded-full text-sm font-bold py-2 px-4 cursor-pointer`}
        onClick={() => toggleStatus('REJECTED')}
      >
        <span className='unselectable'>Rejected </span>
        <span className='unselectable'>∙ {byStatus['REJECTED'].length}</span>
      </div>
      <div
        className={`${selectedStatus.includes('GHOSTED') ? 'bg-[#E3C6BE] text-[#8C4A3D]' : 'border border-input-border text-tertiary-text'} w-fit rounded-full text-sm font-bold py-2 px-4 cursor-pointer`}
        onClick={() => toggleStatus('GHOSTED')}
      >
        <span className='unselectable'>Ghosted </span>
        <span className='unselectable'>∙ {byStatus['GHOSTED'].length}</span>
      </div>
    </div>
  );
}

export default StatusFilter;
