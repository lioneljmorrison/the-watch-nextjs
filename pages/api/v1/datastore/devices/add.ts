import { NextApiRequest, NextApiResponse } from 'next';
import { getParam } from '../../../../../src/utils/utils';
import { Firestore } from '@/lib/firebase/docs';
import { DeviceImport } from '../../interfaces';
import { Jwt, TokenStatus } from '@/utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jwt = new Jwt(),
    token = <string>req.headers?.authorization ?? undefined,
    tokenStatus: TokenStatus = jwt.hasValidBearerToken(token);

  if (tokenStatus.httpStatus !== 200) {
    return res
      .status(tokenStatus.httpStatus)
      .json({ code: tokenStatus.httpStatus, status: tokenStatus.status, message: tokenStatus.desc });
  }

  const accountId = <string>getParam<string>(req, 'accountId')?.toLowerCase(),
    deviceId = <string>getParam<string>(req, 'deviceId'),
    deviceInfo: DeviceImport = {
      deviceName: <string>getParam<string>(req, 'deviceName'),
      deviceType: <string>getParam<string>(req, 'deviceType'),
      hubDeviceId: <string>getParam<string>(req, 'hubDeviceId'),
    },
    result = await Firestore.addDevice(accountId, deviceId, deviceInfo);

  switch (req.method) {
    case 'POST':
      if (accountId) {
        res.status(200).json(result);
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
