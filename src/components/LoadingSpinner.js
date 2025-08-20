import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-8 h-8 animate-spin">
        <div className="h-full w-full border-4 border-gray-200 rounded-full border-t-red-600"></div>
      </div>
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <LoadingSpinner />
        <p className="mt-2 text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
