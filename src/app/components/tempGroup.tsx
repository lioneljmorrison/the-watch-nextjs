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
  const [loadedDevices, setLoadedDevices] = useState<DeviceStatus[]>([]);

  const accountId = 'HCC';
  const SBDevices = new SwitchBotDevices(urls.lambda, accountId);

  useWebSocket(urls.ws, {
    onOpen: () => {
      console.log('WebSocket Established');
    },
    onClose: () => {
      console.log('WebSocket Disconnected');
    },
    onMessage: (event) => {
      const lambdaDevices = JSON.parse(event.data) as LambdaDeviceStatus[];

      setLoadedDevices(
        SBDevices.transformDeviceStatus(
          lambdaDevices,
          SBDevices.getDeviceNames(loadedDevices),
        ),
      );
    },
  });

  useEffect(() => {
    SBDevices.getDevices()
      .then((data) => {
        setLoadedDevices(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

    return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="pt-4 px-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {loadedDevices?.map((temp: DeviceStatus, idx: number) => (
            <TempWidget key={idx} data={temp} prefs={prefs}></TempWidget>
          ))}
        </div>
      </Suspense>
    </>
  );
}