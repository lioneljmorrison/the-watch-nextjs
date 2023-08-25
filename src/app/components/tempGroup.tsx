'use client';
import { DeviceStatus, LambdaDeviceStatus, Preferences } from '../interfaces';
import { SwitchBotDevices } from '../switchBotDevices';
import { useEffect, useState } from 'react';
import TempWidget from './temp';
import useWebSocket from 'react-use-websocket';

export default function TempGroupWidget({
  urls,
  prefs,
}: {
  urls: { ws: string; lambda: string };
  prefs: Preferences;
}) {
  const [isLoading, setIsLoading] = useState(true);
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
          SBDevices.transformDeviceStatus(lambdaDevices, SBDevices.getDeviceNames(loadedDevices)),
        );
      },
    });

  useEffect(() => {
    SBDevices.getDevices()
      .then((data) => {
        setLoadedDevices(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-4 px-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {loadedDevices?.map((temp: DeviceStatus, idx: number) => (
        <TempWidget key={idx} data={temp} prefs={prefs}></TempWidget>
      ))}
    </div>
  );
}
