import React from 'react';
import './App.css';
// import Sidebar from './components/Sidebar';
// import Topbar from './components/Topbar';
// import Dashboard from './components/Dashboard';
// import AddDonor from './components/AddDonor';
// import DonorList from './components/DonorList';
// import Settings from './components/Settings';
// import { supabase } from './supabaseClient';
// import ErrorBoundary from './components/ErrorBoundary';
// import BigDisplayModal from './components/BigDisplayModal';

// const sidebarItems = [
//   { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//   { id: 'add-donor', icon: UserPlus, label: 'Add Donor' },
//   { id: 'donor-list', icon: Users, label: 'Donor List' },
//   // { id: 'settings', icon: SettingsIcon, label: 'Settings' }
// ];

const App = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #ff4b2b, #ff416c)',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '25px',
          padding: '40px 30px',
          width: '90%',
          maxWidth: '800px',
          color: 'white',
          textAlign: 'center',
          userSelect: 'none',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 4rem)',
            fontWeight: '800',
            marginBottom: '1.5rem',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: 1.1,
          }}
        >
          🩸 The blood donation camp successfully registered{' '}
          <span
            style={{
              fontSize: '1.4em',
              fontWeight: '900',
              color: '#FFD700',
              textShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
            }}
          >
            721 donors
          </span>
          .
        </h1>
        <p
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            marginBottom: '1rem',
            fontWeight: '600',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          🙏 We extend our sincere gratitude to all the volunteers for their invaluable support.
        </p>
        <p
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: '600',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          🚫 This website is no longer active and has been formally closed.
        </p>
      </div>
    </div>
  );
};

export default App;