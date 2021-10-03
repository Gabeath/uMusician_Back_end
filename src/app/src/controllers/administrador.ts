import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import EntidadeAdmin from '@core/entities/administrador';
import { IServiceAdmin } from '@app/services/interfaces/administrador';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { generateJWT } from '@app/utils/tokens';
import { inject } from 'inversify';

@controller('/admin')
export class ControllerAdmin extends BaseHttpController implements interfaces.Controller {
  private serviceAdmin: IServiceAdmin;

  constructor(
  @inject(TYPES.ServiceAdmin) serviceAdmin: IServiceAdmin,
  ) {
    super();

    this.serviceAdmin = serviceAdmin;
  }

  @httpPost('/')
  private async criarAdmin(req: Request, res: Response): Promise<EntidadeAdmin> {
    const admin = await this.serviceAdmin.criarAdmin({
      email: req.body.email as string,
      senha: req.body.senha as string,
      nome: req.body.nome as string,
      cpf: req.body.cpf as string,
    });

    const token = generateJWT({ userID: admin.id });

    res.setHeader('authorization', 'Bearer ' + token);

    return admin;
  }

  @httpGet('/me', autenticado)
  private async buscarAdminById(req: Request): Promise<EntidadeAdmin> {
    return this.serviceAdmin.buscarAdminById(req.session.userID);
  }
}