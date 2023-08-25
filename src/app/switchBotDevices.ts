import {
  DeviceStatus,
  Device,
  LambdaDevice,
  LambdaDeviceStatus,
  DeviceMap,
} from './interfaces';

export class SwitchBotDevices {
  private _uri;
  private _accountId;
  private _deviceMap: DeviceMap = {};

  constructor(uri: string, accountId: string) {
    this._uri = uri;
    this._accountId = accountId;
  }

  transformDeviceStatus(deviceData: LambdaDeviceStatus[]): DeviceStatus[] {
    return deviceData.map((device) => {
      const deviceId = device.deviceId.S;
      return {
        created: parseInt(device.created.S),
        accountId: device.accountId.S,
        deviceId: device.deviceId.S,
        deviceType: device.deviceType.S,
        deviceName: this._deviceMap[deviceId].deviceName,
        humidity: device.humidity.N,
        temperature: device.temperature.N,
        battery: device.battery.N,
        range: {
          min: this._deviceMap[deviceId].range?.min,
          max: this._deviceMap[deviceId].range?.max,
        }
      }
    });
  }

  private getDevicesStatus(): Promise<DeviceStatus[]> {
    return fetch(`${this._uri}/get-latest/${this._accountId}`)
      .then((latest) => latest.json())
      .then((devices) => devices.data)
      .then((deviceData: LambdaDeviceStatus[]) =>
        this.transformDeviceStatus(deviceData),
      )
      .catch((err) => err);
  }

  private getAllDevices(): Promise<Device[]> {
    return fetch(`${this._uri}/get-devices/${this._accountId}`)
      .then((devices) => devices.json())
      .then((data) =>
        data.data.map((device: LambdaDevice) => {
          const deviceId = device.deviceId.S;

          this._deviceMap[deviceId] = {
            created: parseInt(device.created.S),
            accountId: device.accountId.S,
            deviceType: device.deviceType.S,
            deviceName: device.deviceName.S,
            range: {
              min: device.range?.M.min.N,
              max: device.range?.M.max.N,
            },
          };

          return { ...this._deviceMap[deviceId], deviceId };
        }),
      )
      .then((data) => {
        return data;
      })
      .catch((err) => err);
  }

  getDevices(): Promise<DeviceStatus[]> {
    return (
      this.getAllDevices()
        .then(() => this.getDevicesStatus())
    );
  }
}
