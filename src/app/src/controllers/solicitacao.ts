import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { Pagination, TipoSolicitacao } from '@core/models';
import EntidadeSolicitacao from '@core/entities/solicitacao';
import { IServiceSolicitacao } from '@app/services/interfaces/solicitacao';
import { Request } from 'express';
import TYPES from '@core/types';
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

  @httpPost('/', autenticado)
  private async criarAdmin(req: Request): Promise<EntidadeSolicitacao> {
    return this.serviceSolicitacao.criarSolicitacao({
      nome: req.body.nome as string,
      tipo: req.body.tipo as TipoSolicitacao,
    }, req.session.userID);
  }

  @httpGet('/pendentes', autenticado)
  private async getSolicitacoesPendentes(req: Request): Promise<Pagination<EntidadeSolicitacao>> {
    return this.serviceSolicitacao.getSolicitacoesPendentes({
      ...controllerPaginationHelper(req.query),
    });
  }
}