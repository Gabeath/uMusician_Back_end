import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { CategoriaPerfil, Pagination, SearchParameterBase } from '@core/models';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import EntidadeServico from '@core/entities/servico';
import { IServiceAvaliacao } from '@app/services/interfaces/avaliacao';
import { IServiceServico } from '@app/services/interfaces/servico';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { controllerPaginationHelper } from '@app/utils/pagination';
import { inject } from 'inversify';
import isPerfilPermitido from '@app/middlewares/perfil';

@controller('/servico')
export class ControllerServico extends BaseHttpController implements interfaces.Controller {
  private serviceServico: IServiceServico;

  constructor(
  @inject(TYPES.ServiceServico) serviceServico: IServiceServico,
  ) {
    super();

    this.serviceServico = serviceServico;
  }

  @httpPost('/', autenticado, isPerfilPermitido(CategoriaPerfil.CONTRATANTE))
  private async solitarPerfil(req: Request): Promise<EntidadeServico> {
    const servico = {
      nome: req.body.servico.nome as string,
      dataInicio: req.body.servico.dataInicio as string,
      dataTermino: req.body.servico.dataTermino as string,
      idApresentacao: req.body.servico.idApresentacao as string,
      endereco: {
        cep: req.body.servico.endereco.cep as string,
        rua: req.body.servico.endereco.rua as string,
        bairro: req.body.servico.endereco.bairro as string,
        cidade: req.body.servico.endereco.cidade as string,
        estado: req.body.servico.endereco.estado as string,
        numero: req.body.servico.endereco.numero as string,
        pais: req.body.servico.endereco.pais as string,
        complemento: req.body.servico.endereco.complemento as string,
      }
    } as EntidadeServico;

    return this.serviceServico.create(req.session.profileID, servico);
  }

  @httpGet('/contratante', autenticado, isPerfilPermitido(CategoriaPerfil.CONTRATANTE))
  private async getServicosContratante(req: Request): Promise<EntidadeServico[]> {
    return this.serviceServico.getServicosContratante(req.session.profileID);
  }
}