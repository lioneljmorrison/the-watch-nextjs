import { NextApiRequest } from 'next';

export function getParam<T>(req: NextApiRequest, paramName: string, dynamicName?: string): T | undefined {
  const params = req?.body && Object.keys(req.body).length ? req.body : req.query;

  // TODO - This should determine if a dynamic name exists to prevent it from generating an error
  try {
    return dynamicName ? <T>(params[paramName] ?? params[dynamicName][1]) : <T>params[paramName];
  } catch (err) {
    return undefined;
  }
}

export function getParamDebug(req: NextApiRequest): boolean {
  return req.query?.debug === 'true' ? true : false;
}
