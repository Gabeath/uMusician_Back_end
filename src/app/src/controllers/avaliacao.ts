import {
  BaseHttpController,
  controller,
  httpGet,
  interfaces,
} from 'inversify-express-utils';
import { Pagination, SearchParameterBase } from '@core/models';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import { IServiceAvaliacao } from '@app/services/interfaces/avaliacao';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { controllerPaginationHelper } from '@app/utils/pagination';
import { inject } from 'inversify';

@controller('/avaliacao')
export class ControllerAvaliacao extends BaseHttpController implements interfaces.Controller {
  private serviceAvaliacao: IServiceAvaliacao;

  constructor(
  @inject(TYPES.ServiceAvaliacao) serviceAvaliacao: IServiceAvaliacao,
  ) {
    super();

    this.serviceAvaliacao = serviceAvaliacao;
  }

  @httpGet('/:idPerfil', autenticado)
  private async getAvaliacoesPaginated(req: Request): Promise<Pagination<EntidadeAvaliacao>> {
    const searchParameter: SearchParameterBase = {
      ...controllerPaginationHelper(req.query),
    };
    return this.serviceAvaliacao.getAvaliacoesPaginated(req.params.idPerfil, searchParameter);
  }
}