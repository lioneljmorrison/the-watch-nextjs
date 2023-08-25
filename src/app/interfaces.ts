export interface NavLinks {
  [label: string]: NavLink;
}

export interface NavLink {
  href: string;
  target?: '_blank' | string;
  disabled?: boolean;
  cssClass?: string;
}

export interface TempRange {
  min: number;
  max: number;
}

export interface Device {
  accountId: string;
  deviceId: string;
  created: number;
  deviceType: string;
  deviceName: string;
  range: TempRange;
}

export interface DeviceMap {
  [deviceId: string]: Omit<Device, "deviceId">;
}

export interface DeviceStatus extends Device {
  humidity: number;
  temperature: number;
  battery: number;
}

export interface keyValuePair {
  [key: string]: string | number;
}

export interface LambdaDevice {
  accountId: { S: string };
  deviceId: { S: string };
  created: { S: string };
  deviceName: { S: string };
  deviceType: { S: string };
  range: {
    M: {
      min: { N: number };
      max: { N: number };
    };
  };
}

export interface LambdaDeviceStatus extends Omit<LambdaDevice, 'deviceName'> {
  deviceName?: { S: string };
  humidity: { N: number };
  temperature: { N: number };
  battery: { N: number };
}

export enum tempUnits {
  'Celcius' = 'C',
  'Fahrenheit' = 'F',
}
export type temperatureUnits = keyof typeof tempUnits;

export interface Preferences {
  unitTemp: tempUnits;
}
