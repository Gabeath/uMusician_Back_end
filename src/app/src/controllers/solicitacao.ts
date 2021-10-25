import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
} from 'inversify-express-utils';
import { Pagination, TipoSolicitacao } from '@core/models';
import EntidadeSolicitacao from '@core/entities/solicitacao';
import { IServiceSolicitacao } from '@app/services/interfaces/solicitacao';
import { Request } from 'express';
import TYPES from '@core/types';
import admin from '@app/middlewares/admin';
import autenticado from '@app/middlewares/autenticado';
import { controllerPaginationHelper } from '@app/utils/pagination';
import { inject } from 'inversify';

@controller('/solicitacao')
export class ControllerSolicitacao extends BaseHttpController implements interfaces.Controller {
  private serviceSolicitacao: IServiceSolicitacao;

  constructor(
  @inject(TYPES.ServiceSolicitacao) serviceSolicitacao: IServiceSolicitacao,
  ) {
    super();

    this.serviceSolicitacao = serviceSolicitacao;
  }

  @httpGet('/pendentes', autenticado, admin)
  private async getSolicitacoesPendentes(req: Request): Promise<Pagination<EntidadeSolicitacao>> {
    return this.serviceSolicitacao.getSolicitacoesPendentes({
      ...controllerPaginationHelper(req.query),
    });
  }

  @httpPut('/:id/rejeitar', autenticado, admin)
  private async rejeitarSolicitacao(req: Request): Promise<void> {
    await this.serviceSolicitacao.rejeitarSolicitacao(req.params.id, req.session.userID);
  }

  @httpPost('/', autenticado, admin)
  private async criarSolicitacao(req: Request): Promise<EntidadeSolicitacao> {
    return this.serviceSolicitacao.criarSolicitacao({
      nome: req.body.nome as string,
      tipo: req.body.tipo as TipoSolicitacao,
    }, req.session.userID);
  }
}