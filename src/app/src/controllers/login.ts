import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import {Request, Response} from 'express';
import TYPES from '@core/types';
import {generateJWT} from '../utils/tokens'

@controller('/login')
export class LoginController extends BaseHttpController implements interfaces.Controller {
  private serviceUsuario: IServiceUsuario;
  constructor(@inject(TYPES.ServiceUsuario) serviceUsuario: IServiceUsuario, ) {
    super();
    this.serviceUsuario = serviceUsuario;
  }

  @httpPost('/')
  private async login(req: Request, res: Response): Promise<Response>{

    const {email, senha, tipoPerfil} = req.body;

    if(!email || !senha || !tipoPerfil)
    return res.status(400).json({
      "message": "argumentos ausentes"
    })
    
    try {
      const usuario = await this.serviceUsuario.buscarUsuario(email, senha, tipoPerfil)
      const token = generateJWT({
        userID: usuario.id,
        profileType: tipoPerfil
      })

      res.setHeader("authorization", 'Bearer '+ token);

      usuario.senha = undefined;

      return res.json(usuario)
    } catch (err){
      return res.status(400).json({
        "message": err.toString()
      })
    }
  }
}