import { NextApiRequest, NextApiResponse } from 'next';
import { SwitchBot } from '../../../../../src/utils/switchbot';
import { getParam } from '../../../../../src/utils/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = <string>getParam<string>(req, 'token'),
    secret = <string>getParam<string>(req, 'secret');

  switch (req.method) {
    case 'GET':
      const switchbot = new SwitchBot(token, secret);

      res.status(200).json(await switchbot.fetchAllDevices());
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
