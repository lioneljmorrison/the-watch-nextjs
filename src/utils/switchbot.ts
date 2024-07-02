import { DeviceList, DeviceStatus, Devices, LogDeviceStatus } from '../../pages/api/v1/interfaces';
import * as crypto from 'crypto-js';

export class SwitchBot {
  private _token: string;
  private _secret: string;
  private _signature: string;
  private _nonce: string;
  private _timestamp: string;
  private _uri = 'https://api.switch-bot.com/v1.1';
  private _devices: Devices = {};

  constructor(token: string, secret: string) {
    this._token = token;
    this._secret = secret;
    this._nonce = '';
    this._timestamp = Date.now.toString();
    this._signature = crypto
      .HmacSHA256(this._token + this._timestamp + this._nonce, this._secret)
      .toString(crypto.enc.Base64);
  }

  get signature(): string {
    return this._signature;
  }

  get devices(): unknown {
    return this._devices;
  }

  private requestOptions(method: 'GET' | 'POST'): RequestInit {
    return {
      method,
      headers: {
        Authorization: this._token,
        nonce: this._nonce,
        t: this._timestamp,
        sign: this._signature,
      },
      redirect: 'follow',
    };
  }

  async fetchAllDevices(): Promise<Devices> {
    return await this.deviceList();
  }

  async deviceList(): Promise<Devices> {
    const requestOptions = this.requestOptions('GET'),
      devices: Devices = {},
      result = await fetch(`${this._uri}/devices`, requestOptions);

    if (result.status !== 200) {
      return {};
    }

    const findString = ['hub', 'hub mini'],
      deviceList = (JSON.parse(await result.text()) as DeviceList).body.deviceList,
      deviceIds = Array.from(new Set(deviceList.map((device) => device.hubDeviceId))),
      hubIds = deviceList
        .filter((device) => findString.includes(device.deviceType.toLocaleLowerCase()))
        .map((device) => device.deviceId),
      sensors = deviceList.filter((device) => !hubIds.includes(device.deviceId));

    deviceIds.forEach((hubId) => {
      devices[hubId] = sensors.filter((device) => device.hubDeviceId === hubId);
    });

    this._devices = Object.keys(devices)
      .filter((key) => devices[key].length > 0)
      .reduce(
        (obj, key) => {
          obj[key] = devices[key];
          return obj;
        },
        {} as { [key: string]: any[] }
      );

    return this._devices;
  }

  async deviceStatus(deviceId: string): Promise<LogDeviceStatus | undefined> {
    const requestOptions = this.requestOptions('GET'),
      result = await fetch(`${this._uri}/devices/${deviceId}/status`, requestOptions),
      deviceData = await result.json();

    return deviceData.statusCode === 100
      ? {
          created: Date.now().toString(),
          accountId: '',
          ...deviceData.body,
        }
      : undefined;
  }
}
