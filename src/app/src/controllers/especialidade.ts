import {
  BaseHttpController,
  controller,
  httpGet,
  interfaces,
} from 'inversify-express-utils';
import EntidadeEspecialidade from '@core/entities/especialidade';
import { IServiceEspecialidade } from '@app/services/interfaces/especialidade';
import { Request } from 'express';
import TYPES from '@core/types';
import { inject } from 'inversify';

@controller('/especialidade')
export class ControllerEspecialidade extends BaseHttpController implements interfaces.Controller {
  private serviceEspecialidade: IServiceEspecialidade;

  constructor(
  @inject(TYPES.ServiceEspecialidade) serviceEspecialidade: IServiceEspecialidade,
  ) {
    super();

    this.serviceEspecialidade = serviceEspecialidade;
  }

  @httpGet('/seletor')
  private getAllEspecialidades(req: Request): Promise<EntidadeEspecialidade[]> {
    return this.serviceEspecialidade.getAll();
  }
}