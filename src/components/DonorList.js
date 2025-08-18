import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { supabase } from '../supabaseClient';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let channel;
    const fetchDonors = async () => {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setDonors(data || []);
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
    <div className="p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-3 sm:px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Donors</h3>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="w-32 sm:w-48 md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Type
                </th>
                <th className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonors.map((donor) => (
                <tr
                  key={donor.id}
                  className={`transition-colors ${donor.isFirstTime ? 'bg-yellow-100 hover:bg-yellow-200' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                  </td>
                  <td className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {donor.gender}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                    {donor.blood_type}
                  </td>
                  <td className="hidden lg:table-cell px-2 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                    {donor.address}
                  </td>
                  <td className="hidden sm:table-cell px-2 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="w-4 h-4 mr-1" />
                      {donor.phone_number}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-2 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                    {donor.created_at ?
                      new Date(donor.created_at).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Legend for first time donor highlight */}
        <div className="px-3 sm:px-4 md:px-6 py-2 bg-yellow-50 border-t border-yellow-200 text-xs sm:text-sm text-yellow-800">
          <span className="inline-block w-3 sm:w-4 h-3 sm:h-4 align-middle rounded bg-yellow-200 mr-1 sm:mr-2"></span>
          Highlighted rows indicate <b>First Time Donors</b>
        </div>
      </div>
    </div>
  );
};

export default DonorList;
