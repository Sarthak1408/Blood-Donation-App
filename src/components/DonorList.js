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
      <div className="fixed bottom-6 right-6 z-30 flex items-center bg-yellow-100 border border-yellow-300 rounded-full px-4 py-2 shadow-lg text-yellow-900 text-xs sm:text-sm font-medium gap-2 pointer-events-none select-none">
        <span className="inline-block w-3 sm:w-4 h-3 sm:h-4 align-middle rounded bg-yellow-300"></span>
        First Time Donor
      </div>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="px-3 sm:px-4 md:px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 bg-gradient-to-r from-red-500 to-red-600 sticky top-0 z-20">
          <h3 className="text-base md:text-lg font-bold text-white tracking-wide uppercase"> All Donors</h3>
          <div className="relative w-full md:w-auto flex items-center">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, address..."
              className="w-full md:w-64 pl-9 pr-4 py-2.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 text-sm shadow-sm transition-all duration-150 bg-white placeholder-gray-400"
              style={{ boxShadow: '0 1px 6px 0 rgba(255,0,0,0.04)' }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto rounded-xl overflow-hidden">
            <thead className="bg-red-50 sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-red-600 uppercase tracking-wider border-b border-gray-100 bg-red-50">Name</th>
                <th className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-red-600 uppercase tracking-wider border-b border-gray-100 bg-red-50">Gender</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-red-600 uppercase tracking-wider border-b border-gray-100 bg-red-50">Blood Type</th>
                <th className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-red-600 uppercase tracking-wider border-b border-gray-100 bg-red-50">Address</th>
                <th className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-red-600 uppercase tracking-wider border-b border-gray-100 bg-red-50">Contact</th>
                <th className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-3 text-left text-sm font-extrabold text-red-600 uppercase tracking-wider border-b border-gray-100 bg-red-50">Time</th>
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
                    className={`transition-all duration-150 border-b border-gray-200 last:border-0 ${donor.isFirstTime ? 'bg-yellow-100 hover:bg-yellow-200' : idx % 2 === 0 ? 'bg-white hover:shadow-md hover:scale-[1.01] hover:bg-red-50' : 'bg-gray-50 hover:shadow-md hover:scale-[1.01] hover:bg-red-50'}`}
                    style={{ boxShadow: '0 1px 4px 0 rgba(255,0,0,0.03)' }}
                  >
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap rounded-l-lg">
                      <div className="text-base font-semibold text-gray-900">{donor.name}</div>
                    </td>
                    <td className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-base text-gray-700 capitalize">
                      {donor.gender}
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-base font-semibold text-red-600">
                      {donor.blood_type}
                    </td>
                    <td className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap text-base text-gray-700">
                      {donor.address}
                    </td>
                    <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-base text-gray-900">
                        <Phone className="w-4 h-4 mr-1 text-red-400" />
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
