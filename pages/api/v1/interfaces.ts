import { Timestamp } from 'firebase-admin/firestore';

export interface Account {
  company: string;
  id: string;
  created: string;
}

export interface Company {
  id?: string;
  name: string;
  joined: string | Timestamp;
  enabled: boolean;
}

export interface Companies {
  [key: string]: Company;
}

export interface DeviceListStatus {
  deviceId?: string;
  deviceName: string;
  deviceType: string;
  enableCloudService?: boolean;
  hubDeviceId: string;
}

export interface Devices {
  [hub: string]: DeviceListStatus[];
}

export interface DeviceImport {
  deviceName: string;
  deviceType: string;
  hubDeviceId: string;
}

export interface DevicesImport {
  [deviceId: string]: DeviceImport;
}

export interface Device extends DeviceListStatus {
  deviceId: string;
  accountId: string;
  created: string;
}

export interface DeviceI extends DeviceImport {
  accountId: string;
  created: string;
}

export interface DeviceContext {
  deviceType: string;
  deviceMac: string;
  temperature: number;
  humidity: number;
  battery: number;
  scale: 'CELSIUS' | 'FAHRENHEIT';
  timeOfSample: number;
}
export interface MeterHookResponse {
  eventType: string;
  eventVersion: string;
  context: DeviceContext;
}

export interface DeviceList {
  statusCode: number;
  body: {
    deviceList: DeviceListStatus[];
  };
  infraredRemoteList: any[];
  message: string;
}

export interface DeviceChangeReport {
  humidity: number;
  temperature: number;
  timeOfSample: Timestamp | string;
}

export interface SwitchbotDeviceStatus {
  created: string;
  deviceId: string;
  deviceType: string;
  hubDeviceId?: string;
  humidity: number;
  temperature: number;
  version?: string;
  battery: number;
}

export interface OpenAPIConfig {
  secret: string;
  token: string;
  nonce: string;
}

export interface DeviceStatusParameters {
  device: string;
}
