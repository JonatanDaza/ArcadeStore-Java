import React from 'react';

const DonutChart = ({ data, colors, centerText, centerValue }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      ...item,
      percentage,
      angle,
      startAngle,
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-100">
        {segments.map((segment, index) => {
          const startAngleRad = (segment.startAngle * Math.PI) / 180;
          const endAngleRad = ((segment.startAngle + segment.angle) * Math.PI) / 180;
          const largeArcFlag = segment.angle > 180 ? 1 : 0;
          
          const x1 = 100 + 70 * Math.cos(startAngleRad);
          const y1 = 100 + 70 * Math.sin(startAngleRad);
          const x2 = 100 + 70 * Math.cos(endAngleRad);
          const y2 = 100 + 70 * Math.sin(endAngleRad);
          
          // Check if coordinates are valid numbers
          if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
            return null; // Skip rendering this segment if coordinates are invalid
          }
          
          const pathData = [
            `M 100 100`,
            `L ${x1} ${y1}`,
            `A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={segment.darkcolor}
              stroke={segment.color}
              className="hover:opacity-80 transition-opacity duration-200"
              style={{
                filter: `drop-shadow(0 2px 4px ${segment.color}40)`,
              }}
            />
          );
        })}
      </svg>
      
      {/* Centro del donut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-white">{centerValue}</div>
        <div className="text-sm text-white">{centerText}</div>
      </div>
    </div>
  );
};

export default DonutChart;
