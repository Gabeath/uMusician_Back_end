import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import BusinessError, { ErrorCodes } from '@core/errors/business';
import { Request, Response } from 'express';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import TYPES from '@core/types';
import {generateJWT} from '../utils/tokens';
import { inject } from 'inversify';

@controller('/login')
export class LoginController extends BaseHttpController implements interfaces.Controller {
  private serviceUsuario: IServiceUsuario;
  constructor(@inject(TYPES.ServiceUsuario) serviceUsuario: IServiceUsuario, ) {
    super();
    this.serviceUsuario = serviceUsuario;
  }

  @httpPost('/')
  private async login(req: Request, res: Response): Promise<Response>{

    const {
      email,
      senha,
      tipoPerfil,
    } = req.body as {
      email: string,
      senha: string,
      tipoPerfil: number,
    };

    if(!email || !senha || !tipoPerfil)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);
    
    try {
      const usuario = await this.serviceUsuario.buscarUsuario(email, senha, tipoPerfil);
      const token = generateJWT({
        userID: usuario.id,
        profileType: tipoPerfil,
      });

      res.setHeader('authorization', 'Bearer '+ token);

      usuario.senha = undefined;

      return res.json(usuario);
    } catch (err){
      return res.status(400).json({
        'message': err.message,
      });
    }
  }
}