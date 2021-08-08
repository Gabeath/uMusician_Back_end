import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { CategoriaPerfil } from '@core/models';
import EntidadeEvento from '@core/entities/evento';
import EntidadeServico from '@core/entities/servico';
import { IServiceEvento } from '@app/services/interfaces/evento';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { inject } from 'inversify';
import isPerfilPermitido from '@app/middlewares/perfil';

@controller('/evento')
export class ControllerEvento extends BaseHttpController implements interfaces.Controller {
  private serviceEvento: IServiceEvento;

  constructor(
  @inject(TYPES.ServiceEvento) serviceEvento: IServiceEvento,
  ) {
    super();

    this.serviceEvento = serviceEvento;
  }

  @httpPost('/', autenticado, isPerfilPermitido(CategoriaPerfil.CONTRATANTE))
  private async createEvento(req: Request): Promise<EntidadeEvento> {
    const evento: EntidadeEvento = {
      nome: req.body.evento.nome as string,
      dataInicio: req.body.evento.dataInicio as string,
      dataTermino: req.body.evento.dataTermino as string,
      servicos: req.body.evento.servicos as EntidadeServico[],
      endereco: {
        cep: req.body.evento.endereco.cep as string,
        rua: req.body.evento.endereco.rua as string,
        bairro: req.body.evento.endereco.bairro as string,
        cidade: req.body.evento.endereco.cidade as string,
        estado: req.body.evento.endereco.estado as string,
        numero: req.body.evento.endereco.numero as string,
        pais: req.body.evento.endereco.pais as string,
        complemento: req.body.evento.endereco.complemento as string,
      },
    };

    return this.serviceEvento.create(req.session.profileID, evento);
  }

  @httpGet('/contratante', autenticado, isPerfilPermitido(CategoriaPerfil.CONTRATANTE))
  private async getEventosByIdContratante(req: Request): Promise<EntidadeEvento[]> {
    return this.serviceEvento.getEventosByIdContratante(req.session.profileID);
  }

  @httpGet('/:id', autenticado)
  private async getDetalhesEvento(req: Request): Promise<EntidadeEvento> {
    return this.serviceEvento.getDetalhesEvento(req.params.id);
  }
}