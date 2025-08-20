import React, { useEffect } from 'react';

const Sidebar = ({ activeTab, setActiveTab, sidebarItems, isOpen, onClose }) => {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-600 transition-opacity duration-300 ease-in-out lg:hidden ${
          isOpen ? 'opacity-50 visible' : 'opacity-0 invisible'
        }`} 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 lg:w-64 bg-gradient-to-b from-orange-100 via-orange-300 to-orange-500 backdrop-blur-sm border-r border-orange-200/30 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar"
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-orange-200/20 backdrop-blur-sm bg-white/5">
          <div>
            <h1 className="yatra-one text-4xl lg:text-3xl font-bold text-blood-red text-outline text-center">सदगुरु 'माँ ज्ञान' जन्मोत्सव</h1>
            <p className="yatra-one text-sm lg:text-lg font-bold text-blood-red text-center">रक्तदान महायज्ञ</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onClose) onClose();
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-red-50 text-red-600 border-r-4 border-red-500 translate-x-1'
                        : 'text-black-600 hover:bg-black-50 hover:text-gray-800 hover:translate-x-1'
                    }`}
                  >
                    <Icon className="w-6 h-6 lg:w-5 lg:h-5" />
                    <span className="text-base font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;