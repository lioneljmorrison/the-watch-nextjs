import React from 'react';
import BatteryMeter from '../BatteryMeter/BatteryMeter'; // Assuming this component exists
import { CiWifiOn, CiWifiOff } from 'react-icons/ci';

interface DisplayMeterProps {
  deviceName: string;
  batteryLevel: number;
  tempLevel: number;
  humidityLevel: number;
  isCelsius: boolean;
  hasSignal: boolean;
  dateTime: Date;
  tempTrend: 'rising' | 'falling' | 'neutral'; // New prop for temperature trend
}

const DisplayMeter: React.FC<DisplayMeterProps> = ({
  deviceName,
  batteryLevel,
  tempLevel,
  humidityLevel,
  isCelsius,
  hasSignal,
  dateTime,
  tempTrend, // Use the new prop
}) => {
  // Determine background color based on tempTrend
  let backgroundColor = 'bg-gray-100'; // Neutral color
  if (tempTrend === 'rising') {
    backgroundColor = 'bg-red-300';
  } else if (tempTrend === 'falling') {
    backgroundColor = 'bg-blue-300';
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short', // 3-letter day (e.g., "Mon")
      month: 'short', // 3-letter month (e.g., "Jan")
      day: 'numeric', // Single or 2-digit date (e.g., "1" or "15")
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const celsiusToFahrenheit = (celsius: number): number => {
    return (celsius * 9) / 5 + 32;
  };

  const temp = isCelsius ? tempLevel.toFixed(1) : celsiusToFahrenheit(tempLevel).toFixed(1);

  return (
    <div
      className={`
        w-56 p-4 rounded-lg flex flex-col justify-between items-center text-gray-900 relative
        ${backgroundColor}
      `}
    >
      <div className="flex justify-between items-center w-full mb-4">
        <BatteryMeter batteryLevel={batteryLevel} />

        {hasSignal ? <CiWifiOn className="text-3xl" /> : <CiWifiOff className="text-3xl" />}
      </div>

      <div className="flex flex-row items-end">
        <div className="text-5xl font-bold leading-none">{temp}</div>
        <div className="flex flex-col ml-1 mb-1">
          <div className="text-2xl font-semibold leading-none font-stretch-expanded">{isCelsius ? '°C' : '°F'}</div>
          <div className="leading-none font-semibold text-lg">{humidityLevel}%</div>
        </div>
      </div>

      <div className="text-lg mt-auto">
        <div className="text-center">{formatDate(dateTime)}</div>
        <div className="text-center">{formatTime(dateTime)}</div>
      </div>

      <div className="mt-6 text-lg font-semibold">{deviceName}</div>

      {tempTrend === 'rising' && <span className="absolute top-1/2 right-4 -translate-y-1/2 text-5xl">↑</span>}
      {tempTrend === 'falling' && <span className="absolute top-1/2 right-4 -translate-y-1/2 text-5xl">↓</span>}
    </div>
  );
};

export default DisplayMeter;
