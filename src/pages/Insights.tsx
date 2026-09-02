import { useEffect, useState } from 'react';
import type { InsightsResponse } from '../lib/types';
import { getInsights } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

function Insights() {
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchInsights() {
      try {
        if (!token) return;
        const response = await getInsights(token);
        setInsights(response);
      } catch (err) {
        console.log(err);
      }
    }
    fetchInsights();
  }, []);

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
              {insights?.totalApplications}
            </span>
          </div>
          <div className='bg-[#FDFBF8] flex flex-col justify-around p-5 flex-1 border border-input-border rounded-xl h-30'>
            <p className='font-bold text-secondary-text text-sm'>
              Applied in the past week
            </p>
            <span className='text-4xl font-extrabold'>
              {insights?.applicationsInPastWeek}
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
                    width: `${insights?.totalApplications ? (insights?.applicationsByStatus?.numApplied / insights?.totalApplications) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{insights?.applicationsByStatus.numApplied}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-sm font-bold text-[#345F3E] w-[25%]'>
                Heard Back
              </span>
              <div className='flex-1 bg-[#EBE3D7] rounded-full h-2 mr-5'>
                <div
                  className='flex-1 rounded-full h-2 mr-5 bg-[#345F3E] '
                  style={{
                    width: `${insights?.totalApplications ? (insights?.applicationsByStatus?.numHeardBack / insights?.totalApplications) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{insights?.applicationsByStatus.numHeardBack}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-sm font-bold text-[#8A3B2E] w-[25%]'>
                Rejected
              </span>
              <div className='flex-1 bg-[#EBE3D7] rounded-full h-2 mr-5'>
                <div
                  className='flex-1 rounded-full h-2 mr-5 bg-[#8A3B2E] '
                  style={{
                    width: `${insights?.totalApplications ? (insights?.applicationsByStatus?.numRejected / insights?.totalApplications) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{insights?.applicationsByStatus.numRejected}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-sm font-bold text-[#8C4A3D] w-[25%]'>
                Ghosted
              </span>
              <div className='flex-1 bg-[#EBE3D7] rounded-full h-2 mr-5'>
                <div
                  className='flex-1 rounded-full h-2 mr-5 bg-[#8C4A3D] '
                  style={{
                    width: `${insights?.totalApplications ? (insights?.applicationsByStatus?.numGhosted / insights?.totalApplications) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{insights?.applicationsByStatus.numGhosted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
