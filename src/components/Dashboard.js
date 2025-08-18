import React, { useEffect, useState } from 'react';
import { Heart, UserPlus } from 'lucide-react';
import { supabase } from '../supabaseClient';


const Dashboard = () => {
  const [donors, setDonors] = useState([]);

  // Calculate stats from donors
  const getStats = () => {
    const total = donors.length;
    const male = donors.filter(d => d.gender === 'male').length;
    const female = donors.filter(d => d.gender === 'female').length;
    const firstTime = donors.filter(d => d.isFirstTime).length;
    const bloodTypes = donors.reduce((acc, donor) => {
      acc[donor.blood_type] = (acc[donor.blood_type] || 0) + 1;
      return acc;
    }, {});
    return { total, male, female, firstTime, bloodTypes };
  };
  const stats = getStats();

  // Fetch donors and subscribe to real-time updates
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

    // Real-time subscription
    channel = supabase.channel('donors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donors' }, payload => {
        // Refetch donors on any change
        fetchDonors();
      })
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-red-500 stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Donors</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-500 stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Male Donors</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.male}</p>
            </div>
            <span className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-blue-500 text-2xl sm:text-3xl">♂️</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-pink-500 stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Female Donors</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.female}</p>
            </div>
            <span className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-pink-500 text-2xl sm:text-3xl">♀️</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-purple-500 stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">First Time</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.firstTime}</p>
            </div>
            <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
          </div>
        </div>
      </div>
      {/* Blood Type Distribution */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Blood Type Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4">
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
            <div key={type} className="text-center p-2 sm:p-4 bg-gray-50 rounded-lg stat-card">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <span className="text-white font-bold text-xs sm:text-sm">{type}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.bloodTypes[type] || 0}</p>
              <p className="text-xs text-gray-500">donors</p>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Donors</h3>
        <div className="space-y-3">
          {donors.slice(0, 3).map(donor => {
            // Convert created_at (UTC) to IST and format as HH:MM using toLocaleString
            let time = '';
            if (donor.created_at) {
              const utcDate = new Date(donor.created_at);
              time = utcDate.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
            }
            return (
              <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">{donor.blood_type}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{donor.name}</p>
                    <p className="text-sm text-gray-500">{donor.address}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

