import {
  Observable,
  catchError,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';
import {
  DeviceStatus,
  Device,
  LambdaDevice,
  LambdaDeviceStatus,
  DeviceMap,
} from './interfaces';
import { fromFetch } from 'rxjs/fetch';

export class SwitchBotDevices {
  private _uri;
  private _accountId;
  private _deviceMap: DeviceMap = {};

  constructor(uri: string, accountId: string) {
    this._uri = uri;
    this._accountId = accountId;
  }

  transformDevices(data: LambdaDevice[]): Device[] {
    return data.map((device) => {
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
    });
  }

  transformDeviceStatus(data: LambdaDeviceStatus[]): DeviceStatus[] {
    return data.map((device) => {
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
        },
      };
    });
  }

  private fetchURI$<T>(
    endpoint: string,
  ): Observable<T[] | { error: boolean; message: string }> {
    return fromFetch(endpoint).pipe(
      switchMap((response) => {
        if (response.ok) {
          // OK return data
          return response.json().then((data) => data.data);
        } else {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError((err) => {
        // Network or other error, handle appropriately
        console.error(err);
        return of({ error: true, message: err.message });
      }),
    );
  }

  getDevices$(): Observable<{ device: Device[]; status: DeviceStatus[] }> {
    const fork = {
      status$: this.fetchURI$<LambdaDeviceStatus>(
        `${this._uri}/get-latest/${this._accountId}`,
      ),
      devices$: this.fetchURI$<LambdaDevice>(
        `${this._uri}/get-devices/${this._accountId}`,
      ),
    };

    return forkJoin(fork).pipe(
      map((data) => ({
        device: this.transformDevices(<LambdaDevice[]>data.devices$),
        status: this.transformDeviceStatus(<LambdaDeviceStatus[]>data.status$),
      })),
    );
  }
}
