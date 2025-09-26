'use client';
import { DeviceStatus, Preferences } from '../interfaces';
// import { SwitchBotDevices, Urls } from '../switchBotDevices';
import React, { Suspense, useEffect } from 'react';
// import TempWidget from './temp';
import Loading from './loading';
import { useDataStore } from '../state/dataStore';
import DisplayMeter from './DisplayMeter/DisplayMeter';

export default function TempGroupWidget({ prefs }: { prefs: Preferences }) {
  const { setAccountId, collection, getCollection } = useDataStore();

  useEffect(() => {
    if (collection) {
      Object.entries(collection).map((deviceStatus) => {
        const [deviceId, deviceInfo] = deviceStatus;
        console.log(deviceId, deviceInfo);
      });
    }
  }, [collection]);

  useEffect(() => {
    setAccountId('HCC');
    getCollection();
  }, []);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="max-w-7xl mx-auto py-4 px-6 lg:px-8">
          <div className="pt-4 px-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Object.entries(collection).map((deviceStatus) => {
              const [deviceId, deviceInfo] = deviceStatus;

              return <DisplayMeter
                batteryLevel={75}
                dateTime={deviceInfo?.status ? new Date(deviceInfo.status.timeOfSample as string) : null}
                deviceName={deviceInfo.deviceName}
                hasSignal={!!deviceInfo?.status}
                humidityLevel={deviceInfo.status?.humidity ?? 0}
                isCelsius
                tempLevel={deviceInfo.status?.temperature ?? 0}
                tempTrend="neutral"
              />;
            })}
          </div>
        </div>
      </Suspense>
    </>
  );
}
