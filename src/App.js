import React, { useState } from 'react';
import { LayoutDashboard, UserPlus, Users, Settings as SettingsIcon } from 'lucide-react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import AddDonor from './components/AddDonor';
import DonorList from './components/DonorList';
import Settings from './components/Settings';
import { supabase } from './supabaseClient';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donors, setDonors] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    bloodType: '',
    phone: '',
    gender: '',
    address: '',
    isFirstTime: false
  });

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'add-donor', icon: UserPlus, label: 'Add Donor' },
    { id: 'donor-list', icon: Users, label: 'Donor List' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.bloodType || !formData.phone || !formData.address || !formData.gender) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare data for Supabase
    const donorData = {
      name: formData.name,
      blood_type: formData.bloodType,
      phone_number: parseInt(formData.phone.replace(/\D/g, '')),
      address: formData.address,
      isFirstTime: formData.isFirstTime,
      gender: formData.gender
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from('donors')
      .insert([donorData]);

    if (error) {
      alert('Error adding donor: ' + error.message);
      return;
    }

    // Optionally, add to local state for instant UI update
    const newDonor = {
      id: data && data[0] && data[0].id ? data[0].id : donors.length + 1,
      ...formData,

      date: new Date().toISOString().split('T')[0]
    };
    setDonors([...donors, newDonor]);
    setFormData({
      name: '',

      bloodType: '',
      phone: '',
      gender: '',
      address: '',
      isFirstTime: false
    });
    alert('Donor added successfully!');
  };

  const getStats = () => {
    const total = donors.length;
    const today = donors.filter(d => d.date === new Date().toISOString().split('T')[0]).length;
    const firstTime = donors.filter(d => d.isFirstTime).length;
    const bloodTypes = donors.reduce((acc, donor) => {
      acc[donor.bloodType] = (acc[donor.bloodType] || 0) + 1;
      return acc;
    }, {});
    return { total, today, firstTime, bloodTypes };
  };

  const stats = getStats();

  // Main Content Renderer
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} donors={donors} />;
      case 'add-donor':
        return <AddDonor formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />;
      case 'donor-list':
        return <DonorList donors={donors} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard stats={stats} donors={donors} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - hidden on mobile unless open */}
      <div className={`fixed inset-0 z-40 lg:relative lg:z-0 h-full ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Overlay - visible only on mobile */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 lg:hidden
            ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:transform-none lg:relative h-screen lg:h-full
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <Sidebar activeTab={activeTab} setActiveTab={tab => { setActiveTab(tab); setSidebarOpen(false); }} sidebarItems={sidebarItems} />
        </div>
      </div>
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
};

export default App;