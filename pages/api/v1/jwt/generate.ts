import { NextApiRequest, NextApiResponse } from 'next';
import { Jwt, TokenStatus } from '@/utils/jwt';
import { Just_Me_Again_Down_Here } from 'next/font/google';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jwt = new Jwt();

  switch (req.method) {
    case 'GET':
      res.status(200).json({ token: jwt.generateToken() });
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
