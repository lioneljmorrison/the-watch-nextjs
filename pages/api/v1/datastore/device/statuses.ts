import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@/lib/firebase/docs';
import { getParam } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accountId = <string>getParam<string>(req, 'accountId')?.toLowerCase(),
    deviceId = <string>getParam<string>(req, 'deviceId'),
    result = await Firestore.getDeviceStatuses(accountId, deviceId);

  console.log(accountId, deviceId);

  switch (req.method) {
    case 'GET':
      if (result) {
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
