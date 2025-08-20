import React from 'react';
import { LoadingOverlay } from './LoadingSpinner';

const AddDonor = ({ formData, handleInputChange, handleSubmit, loading }) => {
  // Allow normal typing, validate on blur
  const handlePhoneBlur = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    handleInputChange({
      ...e,
      target: { ...e.target, value }
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {loading && <LoadingOverlay message="Adding donor..." />}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 rounded-t-xl">
          <h3 className="text-xl md:text-2xl font-bold text-white uppercase">Add Donor</h3>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="Enter full name"
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    className="form-radio text-red-600 w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="form-radio text-red-600 w-4 h-4"
                  />
                  <span className="ml-2 text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {/* Blood Type and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
                >
                  <option value="">Select Blood Type</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  onBlur={handlePhoneBlur}
                  maxLength="10"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="Enter 10 digit Contact Number"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="Enter Address"
              />
            </div>

            {/* First Time Donor Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFirstTime"
                checked={formData.isFirstTime}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                First Time Donor
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:opacity-90 active:transform active:scale-98"
            >
              Add Donor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDonor;
