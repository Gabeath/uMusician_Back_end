import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '@core/errors/unauthorized';
import errorHandler from '@app/middlewares/error-handler';
import { verifyToken } from '../utils/tokens';

export default function autenticado (req: Request, res: Response, next: NextFunction): void {
  const { authorization } = req.headers;

  try {

    if(!authorization)
      throw new UnauthorizedError();
      
    const token = authorization.split(' ');

    if (token[0].toLowerCase() !== 'bearer' || token.length !== 2)
      throw new UnauthorizedError();

    const payload = verifyToken(token[1]);
    
    req.session = {
      userID: payload.userID,
      profileType: payload.profileType,
    };

    return next();
  }
  catch (err) {
    return errorHandler(err, req, res);
  }
}