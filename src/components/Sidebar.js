import React from 'react';
import { Heart } from 'lucide-react';
import '../App.css';

const Sidebar = ({ activeTab, setActiveTab, sidebarItems }) => (
  <div className="w-64 bg-white shadow-lg h-full flex flex-col">
    {/* Logo Section */}
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">LifeFlow</h1>
          <p className="text-sm text-gray-500">Blood Donation Camp</p>
        </div>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-red-50 text-red-600 border-r-4 border-red-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  </div>
);

export default Sidebar;
