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
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-300 px-6 py-5 rounded-t-2xl border border-orange-300">
          <h3 className="text-xl text-center md:text-2xl font-extrabold font-mono tracking-wider text-white uppercase">Add Donor</h3>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 bg-white/80 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-mono font-semibold text-orange-900 mb-2">
                Full Name<span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-orange-300 placeholder:font-mono placeholder:text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all bg-white/90"
                placeholder="Enter full name"
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-mono font-semibold text-orange-900 mb-2">
                Gender<span className="text-orange-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    className="form-radio text-orange-600 w-4 h-4 border-orange-400"
                  />
                  <span className="ml-2 font-mono font-medium  text-orange-900">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="form-radio text-orange-600 w-4 h-4 border-orange-400"
                  />
                  <span className="ml-2 font-mono font-medium text-orange-900">Female</span>
                </label>
              </div>
            </div>

            {/* Blood Type and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono font-semibold text-orange-900 mb-2">
                  Blood Type <span className="text-orange-500">*</span>
                </label>
                <select
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-orange-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all bg-white/90"
                >
                  <option value="" className="font-mono">Select Blood Type</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-mono font-semibold text-orange-900 mb-2">
                  Contact Number <span className="text-orange-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  onBlur={handlePhoneBlur}
                  maxLength="10"
                  className="w-full px-4 py-2.5 rounded-xl border-2 placeholder:font-mono placeholder:text-sm border-orange-300 focus:ring-2 focus:ring-orange-400 tracking-tight focus:border-orange-400 transition-all bg-white/90"
                  placeholder="Enter 10 digit Contact Number"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-mono font-semibold text-orange-900 mb-2">
                Address <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-orange-300 placeholder:font-mono placeholder:text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all bg-white/90"
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
                className="w-5 h-5 text-orange-600 focus:ring-orange-400 border-orange-300 rounded-lg"
              />
              <label className="ml-2 text-base font-mono font-semibold text-orange-900">
                First Time Donor
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-br from-orange-400 to-orange-500 text-white font-mono font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-lg transition-all duration-200 hover:opacity-90 active:transform active:scale-98"
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
