import { NextApiRequest, NextApiResponse } from 'next';
import { SwitchBot } from '../../../../../src/utils/switchbot';
import { getParam } from '@/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = <string>getParam<string>(req, 'token'),
    secret = <string>getParam<string>(req, 'secret'),
    target = <string>getParam<string>(req, 'target');

  switch (req.method) {
    case 'POST':
      const switchbot = new SwitchBot(token, secret),
        result = await switchbot.deleteWebhook(target);

      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json('No Device');
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
