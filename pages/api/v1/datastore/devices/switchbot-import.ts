import { NextApiRequest, NextApiResponse } from 'next';
import { getParam } from '../../../../../src/utils/utils';
import { Firestore } from '@/lib/firebase/docs';
import { DevicesImport } from '../../interfaces';
import { SwitchBot } from '@/utils/switchbot';
import { Jwt, TokenStatus } from '@/utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jwt = new Jwt(),
    jtwToken = <string>req.headers?.authorization ?? undefined,
    tokenStatus: TokenStatus = jwt.hasValidBearerToken(jtwToken);

  if (tokenStatus.httpStatus !== 200) {
    return res
      .status(tokenStatus.httpStatus)
      .json({ code: tokenStatus.httpStatus, status: tokenStatus.status, message: tokenStatus.desc });
  }

  const token = <string>getParam<string>(req, 'token'),
    secret = <string>getParam<string>(req, 'secret'),
    accountId = <string>getParam<string>(req, 'accountId')?.toLowerCase(),
    switchbot = new SwitchBot(token, secret),
    devices = await switchbot.fetchAllDevices(),
    deviceInfo: DevicesImport = {};

  Object.entries(devices).forEach((hubDevices, index) => {
    const [hubId, devices] = [...hubDevices];

    devices.forEach((device) => {
      deviceInfo[device.deviceId as string] = {
        deviceName: device.deviceName,
        deviceType: device.deviceType,
        hubDeviceId: hubId,
      };
    });
  });

  Firestore.addDevicesBulk(accountId, deviceInfo);

  switch (req.method) {
    case 'POST':
      if (accountId) {
        res.status(200).json(deviceInfo);
      } else {
        res.status(204).json('No Content');
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
