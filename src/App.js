import React, { useState, useEffect } from 'react';
import { LayoutDashboard, UserPlus, Users, Settings as SettingsIcon } from 'lucide-react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import AddDonor from './components/AddDonor';
import DonorList from './components/DonorList';
import Settings from './components/Settings';
import { supabase } from './supabaseClient';

const sidebarItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'add-donor', icon: UserPlus, label: 'Add Donor' },
  { id: 'donor-list', icon: Users, label: 'Donor List' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [donors, setDonors] = useState([]);

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

  // Main Content Renderer
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard donors={donors} />;
      case 'add-donor':
        return <AddDonor />;
      case 'donor-list':
        return <DonorList donors={donors} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard donors={donors} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarItems={sidebarItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar onSidebarOpen={() => setSidebarOpen(true)} />
        {/* Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;