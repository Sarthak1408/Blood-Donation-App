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
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 lg:w-64 bg-gradient-to-b from-orange-100/80 via-orange-200/50 to-orange-500/70 backdrop-blur border-r border-orange-200/50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar">

        {/* Logo Section */}
        {/* <div className="p-5 border-b border-orange-300/30 bg-gradient-to-r from-orange-200/30 to-orange-300/30 backdrop-blur-md shadow-md"> */}
          <div className="p-6">
            <h1 className="yatra-one text-4xl lg:text-3xl font-extrabold text-blood-red text-outline text-center drop-shadow-2xl">सदगुरु 'माँ ज्ञान' जन्मोत्सव</h1>
            <p className="yatra-one text-md lg:text-lg font-bold text-blood-red text-center drop-shadow-md">रक्तदान महायज्ञ</p>
          </div>
        {/* </div> */}

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
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 backdrop-blur shadow-md hover:shadow-lg ${
                      activeTab === item.id
                        ? 'bg-red-50/80 text-red-600 border-r-4 border-red-500 translate-x-1 shadow-lg'
                        : 'text-orange-800 hover:bg-orange-50/50 hover:text-orange-900 hover:translate-x-1'
                    }`}
                  >
                    <Icon className="w-6 h-6 lg:w-5 lg:h-5" />
                    <span className="text-base font-mono font-bold">{item.label}</span>
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