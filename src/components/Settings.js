import React from 'react';

const Settings = () => (
  <div className="p-6 space-y-6 animate-fadeIn">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Camp Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Camp Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Camp Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              defaultValue="LifeFlow Blood Donation Camp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Camp Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="Enter camp location"
              defaultValue="Jamshedpur, Jharkhand"
            />
          </div>
        </div>
      </div>
      {/* Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">Email notifications</label>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">SMS notifications</label>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">Auto-backup data</label>
            <input type="checkbox" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
          </div>
        </div>
      </div>
      {/* Data Management */}
      <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 btn-primary">
            Export Data
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 btn-primary">
            Backup Data
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 btn-primary">
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Settings;
