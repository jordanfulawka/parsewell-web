import { useEffect, useState } from 'react';
import { getRandomMessage, type LoadingStage } from '../lib/loadingMessages';

function Loading({ stage }: { stage: LoadingStage }) {
  const [loadingMessage, setLoadingMessage] = useState(getRandomMessage(stage));

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessage(getRandomMessage(stage));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='bg-cream-primary h-full flex flex-col items-center'>
      <div className='mt-50 text-secondary-text text-lg font-medium'>
        {loadingMessage}
      </div>
      <div className='flex gap-5 mt-10'>
        <div className='bg-[#5C7052]/50 w-5 h-5 rounded-full animate-bounce1' />
        <div className='bg-[#8FA680] w-5 h-5 rounded-full animate-bounce2' />
        <div className='bg-[#C77450]/60 w-5 h-5 rounded-full animate-bounce3' />
      </div>
    </div>
  );
}

export default Loading;
