import * as jwt from 'jsonwebtoken';

export interface TokenStatus {
  httpStatus: number;
  status: string;
  desc: string;
}

export class Jwt {
  _secret = <string>process.env.JWT_SECRET;

  hasValidBearerToken(bearerToken: string): TokenStatus {
    if (!bearerToken) {
      return { httpStatus: 418, status: 'not a coffee pot', desc: "I'm a teapot" };
    }

    const token = bearerToken && bearerToken.split(' ')[1];

    if (!this.verifyToken(token)) {
      return { httpStatus: 401, status: 'unauthorized', desc: 'Unauthorized' };
    }

    return { httpStatus: 200, status: 'authorized', desc: 'Authorized' };
  }

  generateToken(): string {
    return jwt.sign({ user: 'morrison-collective' }, this._secret);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this._secret) ?? false;
    } catch {
      return false;
    }
  }
}
