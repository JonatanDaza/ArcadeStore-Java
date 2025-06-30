import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendCard = ({ icon: Icon, title, value, trend, color, bgGradient }) => {
  const isPositive = trend >= 0;
  
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 ${bgGradient}`}>
      {/* Efecto de brillo */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
      
      {/* Patrón de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full bg-white rounded-full transform translate-x-6 -translate-y-6"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${!isPositive && 'transform rotate-180'}`} />
            {Math.abs(trend).toFixed(1)}%
          </div>
        </div>
        
        <h3 className="text-white text-opacity-80 text-sm font-medium mb-2">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className="text-white text-opacity-60 text-xs">vs. mes anterior</p>
      </div>
    </div>
  );
};

export default TrendCard;