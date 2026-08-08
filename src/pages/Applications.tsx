import { Plus } from 'lucide-react';

function Applications() {
  return (
    <div className='h-full flex justify-center'>
      <div className='flex items-center justify-between w-150 h-fit mt-15'>
        <h1 className='text-3xl font-extrabold'>Applications</h1>
        <button className='flex gap-2 bg-[#7FA687] p-3 rounded-2xl text-white font-bold'>
          <Plus /> New Application
        </button>
      </div>
    </div>
  );
}

export default Applications;
