import { DeviceChangeReport, DeviceImport, DeviceStatus } from './interfaces';

export interface DeviceCollection {
  [deviceId: string]: DeviceImport[];
}

export interface Devices {
  [deviceId: string]: DeviceImport;
}

export interface StatusLog {
  [statusId: string]: DeviceChangeReport;
}

export interface DeviceListStatus {
  [deviceId: string]: DeviceStatus;
}
