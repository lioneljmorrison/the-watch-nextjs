import { NextApiRequest, NextApiResponse } from 'next';
import { SwitchBot } from '../../../../../src/utils/switchbot';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body,
    token = body.auth.token,
    secret = body.auth.secret,
    url = body.url;

  switch (req.method) {
    case 'POST':
      const switchbot = new SwitchBot(token, secret),
        result = await switchbot.queryDetailsWebhook(url);

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
