import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@/lib/firebase/docs';
import { DeviceChangeReport, MeterHookResponse } from '../../interfaces';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const switchbotSecrets: { token: string; secret: string } = {
      token: req.query.token as string,
      secret: req.query.secret as string,
    },
    tokenStatus =
      switchbotSecrets.token === process.env.SWITCHBOT_TOKEN &&
      switchbotSecrets.secret === process.env.SWITCHBOT_SECRET;

  if (!tokenStatus) {
    return res.status(218).json({ status: 'not authorized', message: 'authorization required' });
  }

  const accountId = (req.query.accountId as string)?.toLowerCase(),
    body: MeterHookResponse = req.body,
    context = body?.context,
    deviceId = context?.deviceMac,
    status: DeviceChangeReport = {
      timeOfSample: Date(), //context?.timeOfSample,
      humidity: context?.humidity,
      temperature: context?.temperature,
    },
    result = Firestore.addDeviceStatus(accountId, deviceId, status);

  switch (req.method) {
    case 'POST':
      if (accountId) {
        res.status(200).json({ deviceid: context?.deviceMac, status, result });
      } else {
        res.status(204);
      }
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
