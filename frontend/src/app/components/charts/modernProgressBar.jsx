import React from 'react';

const ModernProgressBar = ({ value, maxValue, color, label }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm font-bold text-gray-700">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`,
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"
          />
        </div>
      </div>
    </div>
  );
};

export default ModernProgressBar;