import React, { useEffect, useState } from 'react';
import { Heart, Calendar, UserPlus } from 'lucide-react';
import { supabase } from '../supabaseClient';


const Dashboard = () => {
  const [donors, setDonors] = useState([]);

  // Calculate stats from donors
  const getStats = () => {
    const total = donors.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const today = donors.filter(d => d.created_at && d.created_at.startsWith(todayStr)).length;
    const firstTime = donors.filter(d => d.isFirstTime).length;
    const bloodTypes = donors.reduce((acc, donor) => {
      acc[donor.blood_type] = (acc[donor.blood_type] || 0) + 1;
      return acc;
    }, {});
    return { total, today, firstTime, bloodTypes };
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
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500 stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Heart className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Donors</p>
              <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blood Units</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total * 450}ml</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🩸</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500 stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">First Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats.firstTime}</p>
            </div>
            <UserPlus className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>
      {/* Blood Type Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Blood Type Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
            <div key={type} className="text-center p-4 bg-gray-50 rounded-lg stat-card">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">{type}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.bloodTypes[type] || 0}</p>
              <p className="text-xs text-gray-500">donors</p>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Donors</h3>
        <div className="space-y-3">
          {donors.slice(0, 3).map(donor => (
            <div key={donor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">{donor.blood_type}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{donor.name}</p>
                  <p className="text-sm text-gray-500">{donor.phone_number}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{donor.created_at ? donor.created_at.split('T')[0] : ''}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

