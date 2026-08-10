import { NavLink, Outlet, useNavigate } from 'react-router';
import { List, ChartNoAxesColumn } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function AppLayout() {
  return (
    <div className='h-screen bg-cream-primary flex flex-col'>
      <div className='flex items-center gap-8 p-5 border-2 border-transparent border-b-subtle-border'>
        <h2 className='text-2xl font-bold'>Parsewell</h2>
        <NavLink
          to='/applications'
          className={({ isActive }) =>
            isActive
              ? 'bg-[#DDEBE0] text-[#345F3E] flex gap-3 p-3 rounded-full items-center'
              : 'flex gap-3 p-3 rounded-full items-center'
          }
        >
          <List />
          <span className='font-bold'>Applications</span>
        </NavLink>
        <NavLink
          to='/insights'
          className={({ isActive }) =>
            isActive
              ? 'bg-[#DDEBE0] text-[#345F3E] flex gap-3 p-3 rounded-full items-center'
              : 'flex gap-3 p-3 rounded-full items-center'
          }
        >
          <ChartNoAxesColumn />
          <span className='font-bold'>Insights</span>
        </NavLink>
      </div>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
