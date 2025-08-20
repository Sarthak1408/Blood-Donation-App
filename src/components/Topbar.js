
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Menu } from 'lucide-react';

const Topbar = ({ onSidebarOpen }) => {
  const [totalDonors, setTotalDonors] = useState(0);

  useEffect(() => {
    let channel;
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('donors')
        .select('*', { count: 'exact', head: true });
      if (!error && typeof count === 'number') setTotalDonors(count);
    };
    fetchCount();

    channel = supabase.channel('donors-count-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donors' }, payload => {
        fetchCount();
      })
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-100 to-orange-500 shadow-lg backdrop-blur-sm border-b border-orange-300/30 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between lg:justify-center relative">
      {/* Sidebar open button - left */}
      <button
        className="lg:hidden flex items-center justify-center rounded-full p-1.5 sm:p-2 transition"
        aria-label="Open sidebar"
        onClick={onSidebarOpen}
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
      </button>
      {/* Centered Logo and Website Name */}
      <div className="flex flex-1 justify-center items-center space-x-2 sm:space-x-3">
        {/* <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-red-500 text-lg sm:text-xl font-bold">
          <image src="/public/om.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
        </div> */}
        <span className="yatra-one text-3xl sm:text-5xl lg:text-6xl font-bold text-blood-red tracking-wide drop-shadow-md text-outline">
          रक्तदान महायज्ञ
        </span>
      </div>
      {/* Total Donors Counter - right */}
      <div className="flex items-center">
        <div 
          onClick={() => window.location.href = '/dashboard'} 
          className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold shadow-lg text-xs sm:text-sm lg:text-base whitespace-nowrap uppercase cursor-pointer hover:bg-red-600 transition-colors duration-200 hover:shadow-xl active:bg-red-700"
          title="Total Donors - Click to view Dashboard"
        >
          <span className="hidden sm:inline">Donors : </span>
          {totalDonors}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
