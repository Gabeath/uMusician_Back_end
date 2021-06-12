import { Constants, getEnv } from '@core/constants';
import { Payload } from '@core/models';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const ConstantsEnv: Constants = getEnv();

export const generateJWT = (payload : Payload): string => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '30d',
  });
};

export const verifyToken = (token : string): Payload => {
  return jwt.verify(token, process.env.SECRET_KEY) as Payload;
};

export function cryptToken(token: string): string {
  return crypto.pbkdf2Sync(
    token,
    ConstantsEnv.credential.secret,
    ConstantsEnv.credential.iterations,
    ConstantsEnv.credential.keylen,
    ConstantsEnv.credential.digest,
  ).toString('hex');
}
