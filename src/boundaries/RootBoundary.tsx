import { MoveLeft } from 'lucide-react';
import { Link } from 'react-router';

function RouteBoundary() {
  return (
    <div className='h-screen bg-cream-primary'>
      <div className='flex flex-col items-center h-full'>
        <div className='mt-[25%] flex flex-col gap-3'>
          <div className='text-4xl font-bold'>Something went wrong!</div>
          <div className='text-secondary-text font-xl'>
            Sorry for the inconvenience
          </div>
          <Link
            className='flex gap-2 bg-[#7FA687] p-3 rounded-2xl text-white font-bold cursor-pointer hover:bg-[#6D9476] w-fit mt-8'
            to='/applications'
          >
            <MoveLeft /> Go back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RouteBoundary;
