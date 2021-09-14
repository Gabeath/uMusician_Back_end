import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { CategoriaPerfil, Pagination, SearchParameterBase } from '@core/models';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import { IServiceAvaliacao } from '@app/services/interfaces/avaliacao';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { controllerPaginationHelper } from '@app/utils/pagination';
import { inject } from 'inversify';
import isPerfilPermitido from '@app/middlewares/perfil';

@controller('/avaliacao')
export class ControllerAvaliacao extends BaseHttpController implements interfaces.Controller {
  private serviceAvaliacao: IServiceAvaliacao;

  constructor(
  @inject(TYPES.ServiceAvaliacao) serviceAvaliacao: IServiceAvaliacao,
  ) {
    super();

    this.serviceAvaliacao = serviceAvaliacao;
  }

  @httpPost('/', autenticado, isPerfilPermitido(CategoriaPerfil.CONTRATANTE))
  private async avaliarServico(req: Request): Promise<EntidadeAvaliacao> {
    return this.serviceAvaliacao.create(
      req.body.avaliacao as EntidadeAvaliacao,
      req.session.profileID,
    );
  }

  @httpGet('/:idMusico', autenticado)
  private async getAvaliacoesPaginated(req: Request): Promise<Pagination<EntidadeAvaliacao>> {
    const searchParameter: SearchParameterBase = {
      ...controllerPaginationHelper(req.query),
    };
    return this.serviceAvaliacao.getAvaliacoesPaginated(req.params.idMusico, searchParameter);
  }
}