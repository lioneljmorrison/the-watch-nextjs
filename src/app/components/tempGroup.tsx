'use client';
import { DeviceStatus, LambdaDeviceStatus, Preferences } from '../interfaces';
import { SwitchBotDevices } from '../switchBotDevices';
import React, { Suspense, useEffect, useState } from 'react';
import TempWidget from './temp';
import useWebSocket from 'react-use-websocket';
import Loading from './loading';

export default function TempGroupWidget({
  urls,
  prefs,
}: {
  urls: { ws: string; lambda: string };
  prefs: Preferences;
}) {
  const accountId = 'HCC';
  const [loadedDevices, setLoadedDevices] = useState<DeviceStatus[]>([]);
  const [SBDevices] = useState(new SwitchBotDevices(urls.lambda, accountId));

  useWebSocket(urls.ws, {
    onOpen: () => {
      console.log('WebSocket Established');
    },
    onClose: () => {
      console.log('WebSocket Disconnected');
    },
    onMessage: (event) => {
      const lambdaDevices = JSON.parse(event.data) as LambdaDeviceStatus[];
      setLoadedDevices(SBDevices.transformDeviceStatus(lambdaDevices));
    },
  });

  useEffect(() => {
    // console.log('data$');
    // SBDevices.getDevices$().subscribe(console.log);

    SBDevices.getDevices()
      .then((data) => {
        console.log('data');
        console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="max-w-7xl mx-auto py-4 px-6 lg:px-8">
          <div className="pt-4 px-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {/* {loadedDevices?.map((deviceStatus: DeviceStatus, idx: number) => {
              return (
                <TempWidget
                  key={deviceStatus.deviceId}
                  data={deviceStatus}
                  prefs={prefs}
                ></TempWidget>
              );
            })} */}
          </div>
        </div>
      </Suspense>
    </>
  );
}
