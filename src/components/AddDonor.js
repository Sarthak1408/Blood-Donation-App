import React from 'react';


const AddDonor = ({ formData, handleInputChange, handleSubmit }) => {
  // Allow normal typing, validate on blur
  const handlePhoneBlur = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    handleInputChange({
      ...e,
      target: { ...e.target, value }
    });
  };

  const handleAgeBlur = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let num = parseInt(value, 10);
    if (isNaN(num)) num = '';
    else if (num < 14) num = 14;
    else if (num > 80) num = 80;
    handleInputChange({
      ...e,
      target: { ...e.target, value: num }
    });
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6 md:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Add New Donor</h3>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                onBlur={handleAgeBlur}
                min="14"
                max="80"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                placeholder="Enter age"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Blood Type *
              </label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
              >
                <option value="">Select Blood Type</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handlePhoneBlur}
                maxLength="10"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                placeholder="Enter 10 digit phone number"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <div className="flex gap-3 sm:gap-4 mt-1 sm:mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    className="form-radio text-red-600 w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="ml-1.5 sm:ml-2 text-sm sm:text-base">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="form-radio text-red-600 w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="ml-1.5 sm:ml-2 text-sm sm:text-base">Female</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm sm:text-base"
                placeholder="Enter complete address"
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFirstTime"
              checked={formData.isFirstTime}
              onChange={handleInputChange}
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label className="ml-1.5 sm:ml-2 block text-xs sm:text-sm text-gray-700">
              First time donor
            </label>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl active:transform active:scale-95 btn-primary"
          >
            Add Donor
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDonor;
