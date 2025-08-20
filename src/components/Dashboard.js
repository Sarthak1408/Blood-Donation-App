import React, { useEffect, useState } from 'react';
import { Heart, UserPlus } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend
);


const Dashboard = () => {
  const [donors, setDonors] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time in IST with seconds
  const getFormattedTime = () => {
    return currentTime.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Process data for charts and stats
  const processData = () => {
    const total = donors.length;
    const male = donors.filter(d => d.gender === 'male').length;
    const female = donors.filter(d => d.gender === 'female').length;
    const firstTime = donors.filter(d => d.isFirstTime).length;
    
    // Blood type distribution
    const bloodTypes = donors.reduce((acc, donor) => {
      acc[donor.blood_type] = (acc[donor.blood_type] || 0) + 1;
      return acc;
    }, {});

    return { 
      stats: { total, male, female, firstTime, bloodTypes }
    };
  };

  const data = processData();
  const stats = data.stats;

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
    <div className="p-4 md:p-6 lg:p-8 animate-fadeIn">
      {/* Top Section with Clock and Total Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Digital Clock Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-xl p-6">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-4xl md:text-4xl lg:text-5xl font-mono text-white tracking-wider mb-2">
              {getFormattedTime()}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-8 h-8 text-red-500" />
                <p className="text-xs font-medium text-gray-500 uppercase">Total</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <UserPlus className="w-8 h-8 text-purple-500" />
                <p className="text-xs font-medium text-gray-500 uppercase">First Time</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.firstTime}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 flex items-center justify-center text-blue-500 text-2xl">♂️</span>
                <p className="text-xs font-medium text-gray-500 uppercase">Male</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.male}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-b-4 border-pink-500 hover:shadow-lg transition-shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 flex items-center justify-center text-pink-500 text-2xl">♀️</span> 
                <p className="text-xs font-medium text-gray-500 uppercase">Female</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.female}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Blood Type Distribution */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Blood Type Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
              <div key={type} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">{type}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 text-center mb-1">{stats.bloodTypes[type] || 0}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gender Distribution Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 md:mb-8 text-center">Gender Distribution</h3>
          <div className="w-full h-[300px] md:h-[350px] flex items-center justify-center">
            <div style={{ width: '90%', height: '90%' }}>
              <Doughnut
                data={{
                  labels: ['Male', 'Female'],
                  datasets: [{
                    data: [stats.male, stats.female],
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.9)',
                      'rgba(236, 72, 153, 0.9)'
                    ],
                    borderColor: [
                      'rgb(59, 130, 246)',
                      'rgb(236, 72, 153)'
                    ],
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 15,
                        font: {
                          size: 12
                        },
                        boxWidth: 12
                      }
                    }
                  },
                  cutout: '65%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 md:mb-8 text-center">Recent Donors</h3>
          <div className="space-y-4">
            {donors.slice(0, 4).map((donor, index) => (
              <div key={donor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{donor.blood_type}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{donor.name}</p>
                    <p className="text-sm text-gray-500">{donor.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(donor.created_at).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(donor.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
