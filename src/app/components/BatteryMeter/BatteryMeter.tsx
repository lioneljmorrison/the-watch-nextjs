import React from 'react';

interface BatteryMeterProps {
  batteryLevel: number;
}

const BatteryMeter: React.FC<BatteryMeterProps> = ({ batteryLevel }) => {
  const batteryColor = batteryLevel <= 20 ? 'bg-red-700' : batteryLevel <= 50 ? 'bg-yellow-500' : 'bg-green-500';
  const batteryWidth = `${batteryLevel}%`;

  return (
    <div className="flex items-center rounded-3xl w-12 relative">
      <div className="w-full bg-gray-300 rounded h-6">
        <div
          className={`${batteryColor} h-full transition-all duration-300 rounded`}
          style={{ width: batteryWidth }}
        ></div>
      </div>
      <span
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-gray-900`}
      >
        {Math.min(batteryLevel, 100)}
      </span>
      <div className="absolute -right-1.5 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-gray-300 rounded-sm" />
    </div>
  );
};

export default BatteryMeter;
