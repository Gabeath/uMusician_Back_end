import { NextFunction, Request, Response } from 'express';
import { Payload } from '@core/models';
import UnauthorizedError from '@core/errors/unauthorized';
import errorHandler from '@app/middlewares/error-handler';
import { verifyToken } from '../utils/tokens';

function autenticado (req: Request, res: Response, next: NextFunction): void {
  const { authorization } = req.headers;

  try {
    const token = authorization.split(' ');

    if (token[0].toLowerCase() !== 'bearer' || token.length !== 2)
      throw new UnauthorizedError();

    const payload = verifyToken(token[1]) as Payload;
    
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