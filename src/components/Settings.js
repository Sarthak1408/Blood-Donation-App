import React from 'react';

import { supabase } from '../supabaseClient';

function arrayToCSV(data) {
  if (!data.length) return '';
  const keys = Object.keys(data[0]);
  const header = keys.join(',');
  const rows = data.map(row => keys.map(k => '"' + (row[k] ?? '') + '"').join(','));
  return [header, ...rows].join('\n');
}


const handleBackup = async () => {
  const { data, error } = await supabase.from('donors').select('*');
  if (error) {
    alert('Failed to fetch data: ' + error.message);
    return;
  }
  if (!data || !data.length) {
    alert('No data to backup.');
    return;
  }
  // Exclude id if desired
  const dataNoId = data.map(({ id, ...rest }) => rest);
  const json = JSON.stringify(dataNoId, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'donors-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const Settings = () => {
  // Export data as CSV (excluding id)
  const handleExport = async () => {
    const { data, error } = await supabase
      .from('donors')
      .select('*');
    if (error) {
      alert('Failed to fetch data: ' + error.message);
      return;
    }
    if (!data || !data.length) {
      alert('No data to export.');
      return;
    }
    // Exclude id
    const dataNoId = data.map(({ id, ...rest }) => rest);
    const csv = arrayToCSV(dataNoId);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donors.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all data
  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all donor data? This cannot be undone.')) return;
    const { error } = await supabase.from('donors').delete().neq('id', 0); // delete all rows
    if (error) {
      alert('Failed to delete data: ' + error.message);
    } else {
      alert('All donor data deleted.');
    }
  };

  return (
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
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 btn-primary"
              onClick={handleExport}
            >
              Export Data
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 btn-primary"
              onClick={handleBackup}
            >
              Backup Data
            </button>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 btn-primary"
              onClick={handleClearAll}
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
