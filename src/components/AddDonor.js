import React, { useState } from 'react';
import { LoadingOverlay } from './LoadingSpinner';

const AddDonor = ({ formData, handleInputChange, handleSubmit, loading }) => {
  // Predefined city list
  const cityOptions = [
    'Giridih',
    'Isri', 
    'Koderma',
    'Ranchi',
    'Gaya',
    'Parwalpur',
    'Bihar Sarif',
    'Mahnar',
    'Jamshedpur',
    'Dhanbad',
    'Bokaro',
    'Deoghar',
    'Dumka',
    'Hazaribagh',
    'Ramgarh',
    'Khunti',
    'Latehar',
    'Chatra',
  ];

  // State for city autocomplete
  const [cityFilteredOptions, setCityFilteredOptions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

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

  // Enhanced phone blur handler with validation
  const handlePhoneBlur = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    
    // Update the form data
    handleInputChange({
      ...e,
      target: { ...e.target, value }
    });
    
    // Show validation feedback if number is entered but invalid
    if (value.length === 10 && !isValidPhoneNumber(value)) {
      // You can show an error message here if needed
      console.warn('Invalid phone number entered:', value);
    }
  };

  // Enhanced phone input handler to prevent invalid patterns during typing
  const handlePhoneInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 10) value = value.slice(0, 10); // Limit to 10 digits
    
    handleInputChange({
      ...e,
      target: { ...e.target, name: 'phone_number', value }
    });
  };

  // Handle city input with autocomplete
  const handleCityInputChange = (e) => {
    const value = e.target.value;
    handleInputChange({
      target: { name: 'city', value }  // ensure city is always updated
    });

    if (value.length > 0) {
      const filtered = cityOptions.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setCityFilteredOptions(filtered);
      setShowCitySuggestions(filtered.length > 0);
    } else {
      setShowCitySuggestions(false);
    }
  };

  // Handle city selection from suggestions
  const handleCitySelect = (selectedCity) => {
    handleInputChange({
      target: { name: 'city', value: selectedCity }
    });
    setShowCitySuggestions(false);
  };

  // Hide suggestions when clicking outside
  const handleCityBlur = () => {
    // Delay hiding to allow click on suggestions
    setTimeout(() => setShowCitySuggestions(false), 150);
  };

  // Handle isDikshit checkbox change with proper boolean handling
  const handleIsDikshitChange = (e) => {
    handleInputChange({
      target: {
        name: 'isDikshit',
        type: 'checkbox',
        checked: e.target.checked,
        value: e.target.checked
      }
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {loading && <LoadingOverlay message="Adding donor..." />}
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl shadow-2xl">

        {/* Form Content */}
        <div className="p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-mono font-semibold text-orange-900 mb-2">
                Full Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-orange-300 placeholder:font-mono placeholder:text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all bg-white/90"
                placeholder="Enter full name"
                required
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
                    required
                  />
                  <span className="ml-2 font-mono font-medium text-orange-900">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="form-radio text-orange-600 w-4 h-4 border-orange-400"
                    required
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
                  required
                >
                  <option value="" className="font-mono">Select Blood Type</option>
                  {['B+', 'O+', 'A+', 'AB+', 'A-', 'B-', 'AB-', 'O-'].map(type => (
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
                  onChange={handlePhoneInputChange}
                  onBlur={handlePhoneBlur}
                  maxLength="10"
                  className={`w-full px-4 py-2.5 rounded-xl border-2 placeholder:font-mono placeholder:text-sm focus:ring-2 focus:ring-orange-400 tracking-tight transition-all bg-white/90 ${
                    formData.phone_number && formData.phone_number.length === 10 && !isValidPhoneNumber(formData.phone_number)
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-orange-300 focus:border-orange-400'
                  }`}
                  placeholder="Enter valid 10 digit number"
                  required
                />
                {formData.phone_number && formData.phone_number.length === 10 && !isValidPhoneNumber(formData.phone_number) && (
                  <p className="mt-1 text-xs text-red-600 font-mono">
                    Please enter a valid phone number
                  </p>
                )}
              </div>
            </div>

            {/* City - Autocomplete Input */}
            <div className="relative">
              <label className="block text-sm font-mono font-semibold text-orange-900 mb-2">
                City <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleCityInputChange}
                onBlur={handleCityBlur}
                onFocus={() => {
                  if (formData.city && cityFilteredOptions.length > 0) {
                    setShowCitySuggestions(true);
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-orange-300 placeholder:font-mono placeholder:text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all bg-white/90"
                placeholder="Start typing city name (e.g., Gir...)"
                autoComplete="off"
                required
              />
              
              {/* Autocomplete Suggestions */}
              {showCitySuggestions && cityFilteredOptions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-orange-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                  {cityFilteredOptions.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => handleCitySelect(city)}
                      className="px-4 py-2 hover:bg-orange-100 cursor-pointer font-mono text-orange-900 border-b border-orange-200 last:border-b-0"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Address - Optional */}
            <div>
              <label className="block text-sm font-mono font-semibold text-orange-900 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ''} // Handle null/undefined values
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-orange-300 placeholder:font-mono placeholder:text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all bg-white/90"
                placeholder="Enter Address (Optional)"
                // No required attribute - making it truly optional
              />
            </div>

            {/* Checkboxes Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Time Donor Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFirstTime"
                  checked={formData.isFirstTime || false} // Default to false if undefined
                  onChange={handleInputChange}
                  className="w-5 h-5 text-orange-600 focus:ring-orange-400 border-orange-300 rounded-lg"
                />
                <label className="ml-2 text-base font-mono font-semibold text-orange-900">
                  First Time Donor
                </label>
              </div>

              {/* isDikshit Toggle - Fixed */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDikshit"
                  checked={formData.isDikshit || false} // Default to false if undefined
                  onChange={handleIsDikshitChange} // Use custom handler
                  className="w-5 h-5 text-orange-600 focus:ring-orange-400 border-orange-300 rounded-lg"
                />
                <label className="ml-2 text-base font-mono font-semibold text-orange-900">
                  Dikshit
                </label>
              </div>
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