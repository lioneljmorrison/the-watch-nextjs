import { DeviceChangeReport, DeviceImport } from './interfaces';

export interface DeviceCollection {
  [deviceId: string]: DeviceImport[];
}

export interface Devices {
  [deviceId: string]: DeviceImport;
}

export interface StatusLog {
  [statusId: string]: DeviceChangeReport;
}
