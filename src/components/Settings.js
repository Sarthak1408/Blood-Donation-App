// src/components/Settings.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// PDF libs
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function arrayToCSV(data) {
  if (!data.length) return '';
  const keys = Object.keys(data[0]);
  const header = keys.join(',');
  const rows = data.map(row => keys.map(k => '"' + (row[k] ?? '') + '"').join(','));
  return [header, ...rows].join('\n');
}

const Settings = () => {
  // Controlled Camp Info (used by the PDF)
  const [campInfo, setCampInfo] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
  });

  // Export data as CSV (excluding id)
  const handleExport = async () => {
    const { data, error } = await supabase.from('donors').select('*');
    if (error) {
      alert('Failed to fetch data: ' + error.message);
      return;
    }
    if (!data || !data.length) {
      alert('No data to export.');
      return;
    }
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

  // Generate PDF: Camp details + donor list (with serial, contact, city)
  const handleDownloadCampDetails = async () => {
    try {
      // Fetch donors in order of addition (oldest first)
      const { data: donors, error } = await supabase
        .from('donors')
        .select('name, gender, blood_type, phone_number, city, address')
        .order('created_at', { ascending: true });

      if (error) {
        alert('Failed to fetch donors: ' + error.message);
        return;
      }

      const doc = new jsPDF(); // default A4 portrait in mm

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(campInfo.name?.trim() || 'Blood Donation Camp', 14, 20);

      // Meta
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      let y = 30;
      if (campInfo.date) {
        doc.text(`Date: ${campInfo.date}`, 14, y);
        y += 8;
      }
      if (campInfo.location?.trim()) {
        doc.text(`Location: ${campInfo.location.trim()}`, 14, y);
        y += 8;
      }
      if (campInfo.description?.trim()) {
        const desc = `Description: ${campInfo.description.trim()}`;
        const wrapped = doc.splitTextToSize(desc, 180);
        doc.text(wrapped, 14, y);
        y += wrapped.length * 6 + 4;
      }

      // Donor table with serial, contact, city
      if (donors && donors.length) {
        const rows = donors.map((d, i) => [
          i + 1,
          d?.name ?? '',
          d?.gender ?? '',
          d?.blood_type ?? '',
          d?.phone_number ?? '',
          d?.city ?? '',
          d?.address ?? '',
        ]);
        autoTable(doc, {
          startY: y,
          head: [['S.No.', 'Name', 'Gender', 'Blood Type', 'Contact', 'City', 'Address']],
          body: rows,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [239, 68, 68] }, // "blood red"
          columnStyles: {
            0: { cellWidth: 12 }, // S.No.
            1: { cellWidth: 32 }, // Name
            2: { cellWidth: 18 }, // Gender
            3: { cellWidth: 22 }, // Blood Type
            4: { cellWidth: 28 }, // Contact
            5: { cellWidth: 28 }, // City
            6: { cellWidth: 50 }, // Address
          },
        });
      } else {
        doc.text('No donors found.', 14, y);
      }

      // Safe filename
      const safeName = (campInfo.name || 'camp')
        .replace(/[^\p{L}\p{N}\s_-]+/gu, '')
        .trim()
        .replace(/\s+/g, '-');

      doc.save(`${safeName}-details.pdf`);
    } catch (e) {
      alert('Failed to generate PDF: ' + (e?.message || e));
    }
  };

  // Clear all data
  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all donor data? This cannot be undone.')) return;
    const { error } = await supabase.from('donors').delete().neq('id', 0);
    if (error) {
      alert('Failed to delete data: ' + error.message);
    } else {
      alert('All donor data deleted.');
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-mono font-extrabold text-center text-white mb-6 bg-blood-red p-4 rounded-lg">Settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camp Information */}
          <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl shadow-lg p-6 border border-orange-300 hover:shadow-xl transition-shadow duration-200 mb-6">
            <h3 className="text-xl font-mono font-bold text-center text-orange-900 mb-4">Camp Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-mono font-medium text-gray-700 mb-2">
                  Camp Name
                </label>
                <input
                  type="text"
                  placeholder="Enter camp name"
                  className="w-full px-4 py-2 border-2 border-orange-300 rounded-xl placeholder:font-mono focus:ring-2 focus:ring-blood-red focus:border-blood-red transition-all text-base"
                  value={campInfo.name}
                  onChange={(e) => setCampInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-base font-mono font-medium text-gray-700 mb-2">
                  Camp Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border-2 border-orange-300 rounded-xl placeholder:font-mono focus:ring-2 focus:ring-blood-red focus:border-blood-red transition-all text-base"
                  value={campInfo.date}
                  onChange={(e) => setCampInfo(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-base font-mono font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-orange-300 rounded-xl placeholder:font-mono focus:ring-2 focus:ring-blood-red focus:border-blood-red transition-all text-base"
                  placeholder="Enter camp location"
                  value={campInfo.location}
                  onChange={(e) => setCampInfo(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-base font-mono font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-orange-300 rounded-xl placeholder:font-mono focus:ring-2 focus:ring-blood-red focus:border-blood-red transition-all text-base min-h-[80px]"
                  placeholder="Enter camp description"
                  value={campInfo.description}
                  onChange={(e) => setCampInfo(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl shadow-lg p-6 border border-orange-300 hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-mono text-center font-bold text-orange-900 mb-6">Data Management</h3>
            <div className="flex flex-col gap-4">
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl transition-colors duration-200 text-base  font-mono font-medium shadow-sm hover:shadow-md"
                onClick={handleExport}
              >
                Export Data
              </button>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-colors duration-200 text-base  font-mono font-medium shadow-sm hover:shadow-md"
                onClick={handleDownloadCampDetails}
              >
                Download Camp Details
              </button>

              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl transition-colors duration-200 text-base  font-mono font-medium shadow-sm hover:shadow-md"
                onClick={handleClearAll}
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;