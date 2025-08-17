import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Topbar = ({ activeTab }) => {
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
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800 capitalize">
        {activeTab.replace('-', ' ')}
      </h2>
      <div className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg">
        Total Donors: {totalDonors}
      </div>
    </div>
  );
};

export default Topbar;
