import { DeviceList, Devices, LogDeviceStatus } from '../../pages/api/v1/interfaces';
import * as crypto from 'crypto-js';

interface RequestBody {
  action: string;
  url?: string;
  urls?: string[];
  deviceList?: 'ALL' | string;
}

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

  private requestOptionsGET(): RequestInit {
    return {
      method: 'GET',
      headers: {
        Authorization: this._token,
        nonce: this._nonce,
        t: this._timestamp,
        sign: this._signature,
      },
      redirect: 'follow',
    };
  }

  private requestOptionsPOST(body: RequestBody): RequestInit {
    const config = {
      method: 'POST',
      headers: {
        Authorization: this._token,
        nonce: this._nonce,
        t: this._timestamp,
        sign: this._signature,
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      body: JSON.stringify(body) || undefined,
    };

    return <RequestInit>config;
  }

  async fetchAllDevices(): Promise<Devices> {
    return await this.deviceList();
  }

  async deviceList(): Promise<Devices> {
    const requestOptions = this.requestOptionsGET(),
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
    const requestOptions = this.requestOptionsGET(),
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

  async setupWebhook(target: string) {
    await this.deleteWebhook(target);

    const body: RequestBody = {
        action: 'setupWebhook',
        url: target,
        deviceList: 'ALL',
      },
      requestOptions = this.requestOptionsPOST(body),
      result = await fetch(`${this._uri}/webhook/setupWebhook`, requestOptions);

    return JSON.parse(await result.text());
  }

  async queryWebhook() {
    const body: RequestBody = {
        action: 'queryUrl',
      },
      requestOptions = this.requestOptionsPOST(body),
      result = await fetch(`${this._uri}/webhook/queryWebhook`, requestOptions);

    return JSON.parse(await result.text());
  }

  async queryDetailsWebhook(target: string) {
    const body: RequestBody = {
        action: 'queryDetails',
        urls: [target],
      },
      requestOptions = this.requestOptionsPOST(body),
      result = await fetch(`${this._uri}/webhook/queryWebhook`, requestOptions);

    return JSON.parse(await result.text());
  }

  async deleteWebhook(target: string) {
    const body: RequestBody = {
        action: 'deleteWebhook',
        url: target,
      },
      requestOptions = this.requestOptionsPOST(body),
      result = await fetch(`${this._uri}/webhook/deleteWebhook`, requestOptions);

    return JSON.parse(await result.text());
  }
}
