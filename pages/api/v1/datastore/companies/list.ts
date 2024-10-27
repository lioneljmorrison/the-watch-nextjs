import { NextApiRequest, NextApiResponse } from 'next';
import { Firestore } from '@/lib/firebase/docs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const companies = await Firestore.getCompanies();

  switch (req.method) {
    case 'GET':
      if (companies) {
        res.status(200).json(companies);
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
