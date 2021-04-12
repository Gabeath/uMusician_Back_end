import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/tokens'

export const autenticado = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  try {
    const token = authorization.split(' ')

    if (token[0].toLowerCase() !== 'bearer' || token.length !== 2)
      throw new Error();

    const payload = verifyToken(token[1])
    
    res.locals.user = payload;

    return next();
  }
  catch (err) {
    return res.status(401).json({
      message: "Acesso restrito"
    })
  }
}