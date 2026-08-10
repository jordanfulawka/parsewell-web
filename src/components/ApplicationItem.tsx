import type { Application } from '../lib/types';
import ApplicationStatusBadge from './ApplicationStatusBadge';

function parseDate(raw: string) {
  const truncated = raw.replace(/(\.\d{3})\d+$/, '$1');

  return new Date(truncated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function ApplicationItem({ application }: { application: Application }) {
  return (
    <div className='bg-[#FDFBF8] border border-subtle-border rounded-xl p-6 flex items-center justify-between hover:border-tertiary-text'>
      <div className='flex flex-col'>
        <span className='text-xl font-bold'>{application.companyName}</span>
        <span className='text-secondary-text'>
          {application.roleTitle} ∙ {application.location}
        </span>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-secondary-text text-sm'>
          {application.createdAt ? parseDate(application?.createdAt) : ''}
        </span>
        <ApplicationStatusBadge status={application.applicationStatus} />
      </div>
    </div>
  );
}

export default ApplicationItem;
