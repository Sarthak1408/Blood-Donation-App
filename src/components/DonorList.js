import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { supabase } from '../supabaseClient';
import LoadingSpinner from './LoadingSpinner';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let channel;
    const fetchDonors = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching donors:', error);
        return;
      }
      setDonors(data || []);
      setIsLoading(false);
    };
    fetchDonors();

    channel = supabase.channel('donors-list-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donors' }, payload => {
        fetchDonors();
      })
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Filter donors by search (name, phone, address)
  const filteredDonors = donors.filter(donor => {
    const q = search.toLowerCase();
    return (
      donor.name.toLowerCase().includes(q) ||
      (donor.phone_number + '').includes(q) ||
      (donor.address && donor.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative p-2 sm:p-4 md:p-6 animate-fadeIn min-h-[80vh]">
      {isLoading && <LoadingSpinner />}
      {/* Floating Legend for First Time Donor - now bottom right */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center bg-sky-100 border border-sky-300 rounded-full px-4 py-2 shadow-lg text-sky-900 text-xs sm:text-sm font-medium gap-2 pointer-events-none select-none">
        <span className="inline-block w-3 sm:w-4 h-3 sm:h-4 align-middle rounded bg-sky-400"></span>
        First Time Donor
      </div>
      <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl shadow-xl overflow-hidden border border-orange-300">
        <div className="px-3 sm:px-4 md:px-6 py-5 border-b border-orange-400 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 bg-gradient-to-br from-orange-300 to-orange-400 sticky top-0 z-20">
          <h3 className="text-base md:text-lg font-bold text-white tracking-wide uppercase"> All Donors</h3>
          <div className="relative w-full md:w-auto flex items-center">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, address..."
              className="w-full md:w-64 pl-9 pr-4 py-2.5 rounded-full border border-orange-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm shadow-sm transition-all duration-150 bg-white/90 placeholder-orange-400"
              style={{ boxShadow: '0 1px 6px 0 rgba(234,88,12,0.04)' }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto rounded-xl overflow-hidden">
            <thead className="bg-orange-100/80 sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-orange-800 uppercase tracking-wider border-b border-orange-200 bg-orange-100/80">Name</th>
                <th className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-orange-800 uppercase tracking-wider border-b border-orange-200 bg-orange-100/80">Gender</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-orange-800 uppercase tracking-wider border-b border-orange-200 bg-orange-100/80">Blood Type</th>
                <th className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-orange-800 uppercase tracking-wider border-b border-orange-200 bg-orange-100/80">Address</th>
                <th className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-orange-800 uppercase tracking-wider border-b border-orange-200 bg-orange-100/80">Contact</th>
                <th className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-orange-800 uppercase tracking-wider border-b border-orange-200 bg-orange-100/80">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-base font-medium">No donors found.</td>
                </tr>
              ) : (
                filteredDonors.map((donor, idx) => (
                  <tr
                    key={donor.id}
                    className={`transition-all duration-150 border-b border-orange-200 last:border-0 ${donor.isFirstTime ? 'bg-sky-100 hover:bg-sky-200 font-medium border-l-4 border-l-sky-400' : idx % 2 === 0 ? 'bg-white/80 hover:shadow-md hover:scale-[1.01] hover:bg-orange-50' : 'bg-orange-50/50 hover:shadow-md hover:scale-[1.01] hover:bg-orange-100/50'}`}
                    style={{ boxShadow: '0 1px 4px 0 rgba(234,88,12,0.03)' }}
                  >
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap rounded-l-lg">
                      <div className="text-base font-semibold text-orange-900">{donor.name}</div>
                    </td>
                    <td className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-base text-orange-800 capitalize">
                      {donor.gender}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-base font-semibold text-orange-700">
                      {donor.blood_type}
                    </td>
                    <td className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-base text-orange-800">
                      {donor.address}
                    </td>
                    <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-base text-orange-900">
                        <Phone className="w-4 h-4 mr-1 text-orange-500" />
                        {donor.phone_number}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-xs text-gray-500 rounded-r-lg">
                      {donor.created_at ?
                        new Date(donor.created_at).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          // day: '2-digit',
                          // month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }) : ''}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonorList;
