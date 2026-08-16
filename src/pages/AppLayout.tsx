import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { List, ChartNoAxesColumn, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuth();

  useEffect(() => {
    if (location.pathname === '/') navigate('/applications');
  }, [location.pathname]);

  return (
    <div className='h-screen bg-cream-primary flex flex-col'>
      <div className='flex justify-between bg-cream-primary z-50 items-center gap-8 border-2 border-transparent border-b-subtle-border fixed w-full flex-wrap'>
        <div className='flex items-center gap-8 p-5'>
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
        <div className='flex items-center gap-8 p-5'>
          <button
            className='flex items-center gap-3 border border-input-border px-4 py-2 rounded-full hover:bg-[#ECE3D6]'
            onClick={logout}
          >
            <LogOut size={16} color='#96887d' />
            <span className='text-tertiary-text font-bold'>Logout</span>
          </button>
        </div>
      </div>
      <div className='flex-1 mt-29'>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
