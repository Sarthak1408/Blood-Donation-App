
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
    <div className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between lg:justify-center relative">
      {/* Sidebar open button - left */}
      <button
        className="lg:hidden flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 sm:p-2 transition"
        aria-label="Open sidebar"
        onClick={onSidebarOpen}
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
      </button>
      {/* Centered Logo and Website Name */}
      <div className="flex flex-1 justify-center items-center space-x-2 sm:space-x-3">
        <div className="w-7 h-7 sm:w-9 sm:h-9 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-lg sm:text-xl font-bold">
          {/* LOGO */}
        </div>
        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-wide">Blood Donation</span>
      </div>
      {/* Total Donors Counter - right */}
      <div className="flex items-center">
        <div className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold shadow-lg text-xs sm:text-sm lg:text-base whitespace-nowrap">
          Total Donors: {totalDonors}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
