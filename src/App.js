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
  const [formData, setFormData] = useState({
    name: '',
    blood_type: '',
    phone_number: '',
    gender: '',
    address: '',
    isFirstTime: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.blood_type || !formData.phone_number || !formData.address || !formData.gender) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare data for Supabase
    const donorData = {
      name: formData.name,
      blood_type: formData.blood_type,
      phone_number: parseInt(formData.phone_number.replace(/\D/g, '')),
      address: formData.address,
      isFirstTime: formData.isFirstTime,
      gender: formData.gender
    };

    // Insert into Supabase
    const { error } = await supabase
      .from('donors')
      .insert([donorData]);

    if (error) {
      alert('Error adding donor: ' + error.message);
      return;
    }

    // Reset form
    setFormData({
      name: '',
      blood_type: '',
      phone_number: '',
      gender: '',
      address: '',
      isFirstTime: false
    });
    
    alert('Donor added successfully!');
    setActiveTab('donor-list');
  };

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
        return <AddDonor formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />;
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