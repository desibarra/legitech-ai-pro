import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legitech-accent"></div>
    </div>
  );
};

export default LoadingSpinner;
