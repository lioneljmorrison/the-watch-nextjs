export interface NavLinks {
  [label: string]: NavLink;
}

export interface NavLink {
  href: string;
  target?: '_blank' | string;
  disabled?: boolean;
  cssClass?: string;
}

export interface DeviceStatus {
  created: number;
  accountId: string;
  deviceId: string;
  deviceType: string;
  deviceName: string;
  humidity: number;
  temperature: number;
  battery: number;
  range?: {
    min: number;
    max: number;
  }
}
