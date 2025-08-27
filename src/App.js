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
import ErrorBoundary from './components/ErrorBoundary';
import BigDisplayModal from './components/BigDisplayModal';

const sidebarItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  // { id: 'add-donor', icon: UserPlus, label: 'Add Donor' },
  { id: 'donor-list', icon: Users, label: 'Donor List' },
  // { id: 'settings', icon: SettingsIcon, label: 'Settings' }
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
    city: '',
    isFirstTime: false,
    isDikshit: false
  });
  const [loading, setLoading] = useState(false);
  const [bigModalOpen, setBigModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Phone number validation function
  const isValidPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's exactly 10 digits
    if (cleaned.length !== 10) return false;
    
    // Check if all digits are the same (invalid patterns)
    if (/^(.)\1{9}$/.test(cleaned)) return false;
    
    // Check if it starts with 0 or 1 (invalid Indian mobile numbers)
    if (cleaned.startsWith('0') || cleaned.startsWith('1')) return false;
    
    // Check for other invalid patterns
    const invalidPatterns = [
      /^123456789[0-9]$/, // Sequential numbers
      /^987654321[0-9]$/, // Reverse sequential
      /^1234567890$/,     // Classic test number
      /^9876543210$/,     // Another test number
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(cleaned));
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!formData.name || !formData.blood_type || !formData.phone_number || !formData.gender) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const phoneNumber = formData.phone_number.replace(/\D/g, '');
    if (phoneNumber.length !== 10) {
      alert('Phone number must be exactly 10 digits');
      setLoading(false);
      return;
    }

    // Enhanced phone number validation
    if (!isValidPhoneNumber(phoneNumber)) {
      alert('Please enter a valid phone number. Numbers like 0000000000, 1111111111, or numbers starting with 0 or 1 are not allowed.');
      setLoading(false);
      return;
    }

    const normalizedName = formData.name.trim().replace(/\s+/g, ' ');

    // Check for duplicate entry - case insensitive name comparison
    const { data: existingDonors } = await supabase
      .from('donors')
      .select('*')
      .eq('phone_number', phoneNumber);

    // Check for duplicate considering normalized names
    const isDuplicate = existingDonors?.some(donor => 
      donor.name.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedName.toLowerCase()
    );

    if (isDuplicate) {
      alert('Donor with this Name and Contact number already exists!');
      setLoading(false);
      return;
    }

    // Prepare data for Supabase
    const donorData = {
      name: normalizedName,
      blood_type: formData.blood_type,
      phone_number: phoneNumber,
      address: formData.address,
      city: formData.city,
      isFirstTime: formData.isFirstTime,
      isDikshit: !!formData.isDikshit,
      gender: formData.gender
    };

    try {
      const { error } = await supabase
        .from('donors')
        .insert([donorData]);
      if (error) throw error;
    } catch (error) {
      if (error.code === '23505') {
        alert('A donor with this phone number already exists!');
      } else {
        alert('Error adding donor: ' + error.message);
      }
      setLoading(false);
      return;
    }

    // Reset form
    setFormData({
      name: '',
      blood_type: '',
      phone_number: '',
      gender: '',
      address: '',
      city: '',
      isFirstTime: false,
      isDikshit: false
    });
    
    alert('Donor added successfully!');
    setLoading(false);
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

  // Calculate stats for modal
  const total = donors.length;
  const male = donors.filter(d => d.gender === 'male').length;
  const female = donors.filter(d => d.gender === 'female').length;
  const stats = { total, male, female };

  // Main Content Renderer
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard donors={donors} />;
      case 'add-donor':
        return <AddDonor formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} loading={loading} />;
      case 'donor-list':
        return <DonorList donors={donors} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard donors={donors} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-orange-100">
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
          <Topbar
            onSidebarOpen={() => setSidebarOpen(true)}
            onDonorCountClick={() => setBigModalOpen(true)}
          />
          {/* Main Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-orange-100">
            <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4">
              {renderMainContent()}
            </div>
          </main>
          {/* Big Display Modal */}
          <BigDisplayModal
            open={bigModalOpen}
            onClose={() => setBigModalOpen(false)}
            stats={stats}
            donors={donors}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;