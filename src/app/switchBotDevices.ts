import {
  DeviceStatus,
  Device,
  LambdaDevice,
  LambdaDeviceStatus,
  keyValuePair,
} from './interfaces';

export class SwitchBotDevices {
  private _uri;
  private _accountId;
  private _deviceNames: keyValuePair = {};

  constructor(uri: string, accountId: string) {
    this._uri = uri;
    this._accountId = accountId;
  }

  transformDeviceStatus(
    deviceData: LambdaDeviceStatus[],
    deviceNames?: keyValuePair,
  ): DeviceStatus[] {
    return deviceData.map((device) => {
      return {
        created: parseInt(device.created.S),
        accountId: device.accountId.S,
        deviceId: device.deviceId.S,
        deviceType: device.deviceType.S,
        deviceName: deviceNames
          ? deviceNames?.[device.deviceId.S]?.toString()
          : this._deviceNames
          ? this._deviceNames?.[device.deviceId.S]?.toString()
          : '',
        humidity: device.humidity.N,
        temperature: device.temperature.N,
        battery: device.battery.N,
      };
    });
  }

  private getDevicesStatus(deviceNames: keyValuePair): Promise<DeviceStatus[]> {
    return fetch(`${this._uri}/get-latest/${this._accountId}`)
      .then((latest) => latest.json())
      .then((devices) => devices.data)
      .then((deviceData: LambdaDeviceStatus[]) =>
        this.transformDeviceStatus(deviceData, this._deviceNames),
      )
      .catch((err) => err);
  }

  private getAllDevices(): Promise<Device[]> {
    return fetch(`${this._uri}/get-devices/${this._accountId}`)
      .then((devices) => devices.json())
      .then((data) =>
        data.data.map((device: LambdaDevice) => ({
          created: parseInt(device.created.S),
          accountId: device.accountId.S,
          deviceId: device.deviceId.S,
          deviceType: device.deviceType.S,
          deviceName: device.deviceName.S,
        })),
      )
      .catch((err) => err);
  }

  getDevices(): Promise<DeviceStatus[]> {
    return this.getAllDevices()
      .then((devices) => this.getDeviceNames(devices))
      .then((deviceNames) => this.getDevicesStatus(deviceNames));
  }

  get deviceNames(): keyValuePair {
    return this._deviceNames;
  }

  getDeviceNames(devices: Device[] | DeviceStatus[]): keyValuePair {
    const deviceNames: keyValuePair = {};

    devices?.forEach((device) => {
      deviceNames[device.deviceId] = device.deviceName;
    });

    this._deviceNames = deviceNames;

    return deviceNames;
  }
}
