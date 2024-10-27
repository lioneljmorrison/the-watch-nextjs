import { NextApiRequest, NextApiResponse } from 'next';
import { getParam } from '../../../../../src/utils/utils';
import { Firestore } from '@/lib/firebase/docs';
import { Company } from '../../interfaces';
import { Timestamp } from 'firebase-admin/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const companyInfo: Company = {
      name: <string>getParam<string>(req, 'companyName'),
      id: <string>getParam<string>(req, 'companyId')?.toLowerCase(),
      enabled: true,
      joined: Timestamp.fromDate(new Date()),
    },
    result = await Firestore.addCompany(companyInfo);

  switch (req.method) {
    case 'POST':
      if (companyInfo.name && companyInfo.id) {
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
