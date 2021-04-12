import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import TYPES from '@core/types';
import { inject } from 'inversify';

type tipoValidacao = {
  valido: boolean,
  message?: string
};

@controller('/validacao')
export class ValidacaoController extends BaseHttpController implements interfaces.Controller {
  private serviceUsuario: IServiceUsuario;
  constructor(@inject(TYPES.ServiceUsuario) serviceUsuario: IServiceUsuario,) {
    super();
    this.serviceUsuario = serviceUsuario;
  }

  @httpPost('/')
  private async login(req: Request, res: Response): Promise<tipoValidacao | Response> {

    const { email, cpf } = req.body;

    if (!email || !cpf)
      return res.status(400).json({
        message: 'argumentos ausentes'
      });

    const emailExists = await this.serviceUsuario.existsByEmail(email);

    if (emailExists)
      return {
        valido: false,
        message: 'Este e-mail ja está em uso'
      };

    const cpfExists = await this.serviceUsuario.existsByCPF(cpf);

    if (cpfExists)
      return {
        valido: false,
        message: 'Este CPF ja está em uso'
      };

    return {
      valido: true
    };
  }
}