import {
  BaseHttpController,
  controller,
  httpGet,
  interfaces,
} from 'inversify-express-utils';
import EntidadeServico from '@core/entities/servico';
import { IServiceServico } from '@app/services/interfaces/servico';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { inject } from 'inversify';

@controller('/servico')
export class ControllerServico extends BaseHttpController implements interfaces.Controller {
  private serviceServico: IServiceServico;

  constructor(
  @inject(TYPES.ServiceServico) serviceServico: IServiceServico,
  ) {
    super();

    this.serviceServico = serviceServico;
  }

  @httpGet('/:id', autenticado)
  private async getDetalhesServico(req: Request): Promise<EntidadeServico | null> {
    return this.serviceServico.getDetalhesServico(req.params.id);
  }
}