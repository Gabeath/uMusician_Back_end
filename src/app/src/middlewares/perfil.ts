import { NextFunction, Request, Response } from 'express';
import { CategoriaPerfil } from '@core/models/enumerators';
import ForbiddenError from '@core/errors/forbidden';

function isPerfilPermitido(perfil: CategoriaPerfil) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.session.profileType !== perfil)
      throw new ForbiddenError();

    return next();
  };
}