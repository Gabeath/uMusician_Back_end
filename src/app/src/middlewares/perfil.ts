import { Request, Response, NextFunction } from 'express'
import {CategoriaPerfil} from '../../../core/src/models/enumerators'

export const isPerfilContratante = async (req: Request, res: Response, next: NextFunction) => {
  
  if(res.locals.user.profileType !== CategoriaPerfil.CONTRATANTE)
    return res.status(403).json({
      "message": "Acesso negado"
    });

  return next();
}

export const isPerfilMusico = async (req: Request, res: Response, next: NextFunction) => {
  
  if(res.locals.user.profileType !== CategoriaPerfil.MUSICO)
    return res.status(403).json({
      "message": "Acesso negado"
    });

  return next();
}