'use client';
import { differenceInHours, format } from 'date-fns';
import { DeviceStatus, Preferences, TempRange, tempUnits } from '../interfaces';

export default function TempWidget({
  data,
  prefs,
}: {
  data: DeviceStatus;
  prefs: Preferences;
}) {
  const datetime = new Date(data.created);
  const time = format(datetime, 'H:mm');
  const hrs = differenceInHours(Date.now(), datetime);
  const battery = batteryStatus(data.battery);
  const sensorStatusColour = sensorStatus(data.temperature, data?.range);
  const offline = hrs >= 6;
  const displayOverlay = offline ? 'absolute' : 'hidden';
  const temperature = tempDisplay(offline, data.temperature, prefs.unitTemp);

  function tempDisplay(
    offline: boolean,
    temp: number,
    unit: tempUnits,
  ): string {
    return offline ? `--.-°${unit}` : `${temp}°${unit}`;
  }

  function sensorStatus(temp: number, range: TempRange | undefined): string {
    return (range?.min && (temp < range.min))
      ? 'bg-blue-500'
      : (range?.max && (temp > range.max))
      ? 'bg-pink-700'
      : 'bg-zinc-600';
  }

  function batteryStatus(battery: number) {
    return {
      bgColor:
        battery <= 20
          ? 'bg-red-700'
          : battery <= 50
          ? 'bg-slate-50'
          : 'bg-slate-50',
      bgWidth:
        battery <= 20
          ? 'w-1/5'
          : battery <= 50
          ? 'w-1/2'
          : battery <= 75
          ? 'w-3/4'
          : 'w-full',
    };
  }

  return (
    <div
      className={`w-40 mx-auto ${sensorStatusColour} text-slate-50 rounded-xl relative`}
    >
      <div
        className={`${displayOverlay} bg-black bg-opacity-60 z-10 h-full w-full flex items-center justify-center rounded-xl`}
      ></div>
      <div className="z-20 pt-2 py-2 text-center text-lg relative">
        {data.deviceName}
      </div>
      <div className="text-center text-3xl font-bold">{temperature}</div>
      <div className="px-2 py-1 grid grid-cols-2 gap-4">
        <div className="text-base">{data.humidity}%</div>
        <div className="text-right">
          <div className="p-1 bg-zinc-300 w-full h-full rounded">
            <div
              className={`${battery.bgWidth} ${battery.bgColor} h-full rounded`}
            ></div>
          </div>
        </div>
      </div>
      <div className="px-2 pt-1 pb-2 grid grid-cols-2 gap-4">
        <div className="text-sm">{datetime.toLocaleDateString()}</div>
        <div className="text-sm text-right">{time}</div>
      </div>
    </div>
  );
}
