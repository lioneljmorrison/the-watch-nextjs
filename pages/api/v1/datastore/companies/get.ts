import { NextApiRequest, NextApiResponse } from 'next';
import { getParam } from '../../../../../src/utils/utils';
import { Firestore } from '@/lib/firebase/docs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accountId = <string>getParam<string>(req, 'accountId')?.toLowerCase(),
    company = await Firestore.getCompanyDetails(accountId);

  switch (req.method) {
    case 'GET':
      if (company) {
        res.status(200).json(company);
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
