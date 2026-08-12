import { AlertCircle, X } from 'lucide-react';

function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  if (!message) return null;

  return (
    <div className='bg-[#E8C4B8] border border-[#8A3B2E] text-[#8A3B2E] rounded-xl py-2 px-4 flex items-center justify-between gap-3'>
      <div className='flex items-center gap-2'>
        <AlertCircle size={18} />
        <span className='font-semibold text-sm'>{message}</span>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className='cursor-pointer'>
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default ErrorBanner;
