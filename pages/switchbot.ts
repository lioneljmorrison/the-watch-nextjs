import { DeviceList, DeviceListStatus, Devices } from "./api/v1/interfaces";
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
        this._signature = crypto.HmacSHA256(this._token + this._timestamp + this._nonce, this._secret).toString(crypto.enc.Base64);
    }

    get signature(): string {
        return this._signature;
    }

    get devices(): unknown {
        return this._devices;
    }

    async initalize(): Promise<Devices> {
        const requestOptions: RequestInit = {
            method: 'GET',
            headers: {
                Authorization: this._token,
                nonce: this._nonce,
                t: this._timestamp,
                sign: this._signature,
            },
            redirect: 'follow',
        };

        const result = await fetch(`${this._uri}/devices`, requestOptions);

        if (result.status !== 200) {
            return {};
        }

        const findString = ['hub', 'hub mini'],
            devices = (JSON.parse(await result.text()) as DeviceList).body.deviceList,
            deviceIds = Array.from(new Set(devices.map(device => device.hubDeviceId))),
            hubIds = devices.filter(device => findString.includes(device.deviceType.toLocaleLowerCase()))
                .map(device => device.deviceId),
            sensors = devices.filter(device => !hubIds.includes(device.deviceId));

        deviceIds.forEach(hubId => {            
            this._devices[hubId] = sensors.filter(device => device.hubDeviceId === hubId);
        })

        return this._devices;
    }
}