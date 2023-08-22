import MainNav from './components/nav';
import TempWidget from './components/temp';
import { navData, prefs } from './data';
import {
  Devices,
  DeviceStatus,
  keyValuePair,
  LambdaDevice,
  LambdaDeviceStatus,
} from './interfaces';

export default async function Home() {
  async function getDeviceStatus(
    accountId: string,
    deviceNames: keyValuePair,
  ): Promise<DeviceStatus[]> {
    const response = await fetch(
      `https://28a5luoh60.execute-api.us-east-2.amazonaws.com/Prod/get-latest/${accountId}`,
    );
    const deviceData: LambdaDeviceStatus[] = (await response.json()).data;

    return deviceData.map((device) => {
      return {
        created: parseInt(device.created.S),
        accountId: device.accountId.S,
        deviceId: device.deviceId.S,
        deviceType: device.deviceType.S,
        deviceName: deviceNames[device.deviceId.S].toString() || '',
        humidity: device.humidity.N,
        temperature: device.temperature.N,
        battery: device.battery.N,
      };
    });
  }

  async function getDevices(accountId: string): Promise<Devices[]> {
    const response = await fetch(
      `https://28a5luoh60.execute-api.us-east-2.amazonaws.com/Prod/get-devices/${accountId}`,
    );
    const deviceData: LambdaDevice[] = (await response.json()).data;

    return deviceData.map((device) => ({
      created: parseInt(device.created.S),
      accountId: device.accountId.S,
      deviceId: device.deviceId.S,
      deviceType: device.deviceType.S,
      deviceName: device.deviceName.S,
    }));
  }

  const devices = await getDevices('HCC');
  const deviceNames: keyValuePair = {};

  devices.forEach((device) => {
    deviceNames[device.deviceId] = device.deviceName;
  });

  return getDeviceStatus('HCC', deviceNames).then((devices) => {
    return (
      <>
        <MainNav data={navData} name="Hardwick Cider Company"></MainNav>
        <div className="pt-4 px-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {devices.map((temp: DeviceStatus, idx: number) => {
            return (
              <TempWidget key={idx} data={temp} prefs={prefs}></TempWidget>
            );
          })}
        </div>
      </>
    );
  });
}
