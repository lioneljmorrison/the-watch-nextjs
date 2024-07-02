import { NextApiRequest, NextApiResponse } from 'next';
import { SwitchBot } from '../../../switchbot';
import { getParam } from '../../../utils';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = <string>getParam<string>(req, 'token'),
        secret = <string>getParam<string>(req, 'secret');

    switch (req.method) {
        case 'GET':
            const switchbot = new SwitchBot(token, secret);
            
            await switchbot.initalize();

            res.status(200).json(switchbot.devices);
            break;

        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            break;
    }
}