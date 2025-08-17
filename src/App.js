import React, { useState } from 'react';
import { LayoutDashboard, UserPlus, Users } from 'lucide-react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import AddDonor from './components/AddDonor';
import DonorList from './components/DonorList';
import Settings from './components/Settings';
import { supabase } from './supabaseClient';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donors, setDonors] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 25,
      bloodType: "A+",
      phone: "+91-9876543210",
      email: "john@example.com",
      address: "123 Main St, Jamshedpur",
      date: "2024-08-17",
      isFirstTime: false
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 30,
      bloodType: "O+",
      phone: "+91-9876543211",
      email: "jane@example.com",
      address: "456 Oak Ave, Jamshedpur",
      date: "2024-08-17",
      isFirstTime: true
    },
    {
      id: 3,
      name: "Raj Kumar",
      age: 28,
      bloodType: "B+",
      phone: "+91-9876543212",
      email: "raj@example.com",
      address: "789 Park Road, Jamshedpur",
      date: "2024-08-16",
      isFirstTime: false
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodType: '',
    phone: '',
    email: '',
    address: '',
    isFirstTime: false
  });

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'add-donor', icon: UserPlus, label: 'Add Donor' },
    { id: 'donor-list', icon: Users, label: 'Donor List' },
    // { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.age || !formData.bloodType || !formData.phone || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare data for Supabase
    const donorData = {
      name: formData.name,
      age: parseInt(formData.age),
      blood_type: formData.bloodType,
      phone_number: parseInt(formData.phone.replace(/\D/g, '')),
      address: formData.address,
      isFirstTime: formData.isFirstTime
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
      age: parseInt(formData.age),
      date: new Date().toISOString().split('T')[0]
    };
    setDonors([...donors, newDonor]);
    setFormData({
      name: '',
      age: '',
      bloodType: '',
      phone: '',
      email: '',
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
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarItems={sidebarItems} />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar activeTab={activeTab} totalDonors={stats.total} />
        {/* Main Area */}
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default App;