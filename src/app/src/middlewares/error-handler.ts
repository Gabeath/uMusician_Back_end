import { Request, Response } from 'express';
import httpStatus from 'http-status';

export default function errorHandler(err: any, req: Request, res: Response): void {
  if (err.isBusinessError) {
    res.status(httpStatus.BAD_REQUEST).json({
      error: err.code,
      options: err.options,
    });

  } else if (err.isIntegrationError) {
    res.status(httpStatus.BAD_REQUEST).json({
      error: err.message as string,
    });
  } else if (err.isUnauthorizedError || err.name === 'TokenExpiredError') {
    res.sendStatus(httpStatus.UNAUTHORIZED);
  } else if (err.isForbiddenError) {
    res.sendStatus(httpStatus.FORBIDDEN);
  }
}
