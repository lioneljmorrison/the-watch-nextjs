'use client';
import { DeviceStatus, Preferences } from '../interfaces';
import { SwitchBotDevices, Urls } from '../switchBotDevices';
import React, { Suspense, useEffect, useState } from 'react';
import TempWidget from './temp';
import Loading from './loading';

export default function TempGroupWidget({
  urls,
  prefs,
}: {
  urls: Urls;
  prefs: Preferences;
}) {
  const accountId = 'HCC';
  const [loadedDevices, setLoadedDevices] = useState<DeviceStatus[]>([]);
  const [SBDevices] = useState(new SwitchBotDevices(urls, accountId));

  useEffect(() => {
    SBDevices.connection$.subscribe({
      next: (status) =>
        setLoadedDevices(SBDevices.transformDeviceStatus(status)),
    });
    SBDevices.openEvent$.subscribe({
      next: () => console.log('WebSocket Established'),
    });
    SBDevices.closeEvent$.subscribe({
      next: () => console.log('WebSocket Disconnected'),
    });
  }, []);

  useEffect(() => {
    SBDevices.getDevices$().subscribe({
      next: (data) => setLoadedDevices(data.status),
      error: (err) => console.log(`Opps: ${err}`),
      complete: () => console.log('All Done'),
    });
  }, []);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="max-w-7xl mx-auto py-4 px-6 lg:px-8">
          <div className="pt-4 px-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {loadedDevices?.map((deviceStatus: DeviceStatus, idx: number) => {
              return (
                <TempWidget
                  key={deviceStatus.deviceId}
                  data={deviceStatus}
                  prefs={prefs}
                ></TempWidget>
              );
            })}
          </div>
        </div>
      </Suspense>
    </>
  );
}
