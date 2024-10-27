import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@/lib/firebase/docs';
import { getParam } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accountId = <string>getParam<string>(req, 'accountId')?.toLowerCase(),
    deviceId = <string>getParam<string>(req, 'deviceId'),
    statusId = <string>getParam<string>(req, 'statusId');

  switch (req.method) {
    case 'GET':
      if (accountId && deviceId && statusId) {
        try {
          const result = await Firestore.getDeviceStatus(accountId, deviceId, statusId);
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json(error);
        }
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
