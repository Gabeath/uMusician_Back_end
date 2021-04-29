import {
  BaseHttpController,
  controller,
  httpGet,
  interfaces
} from 'inversify-express-utils';
import { IPerfilSearchParameter, Pagination } from '../../../core/src/models/pagination';
import EntidadePerfil from '@core/entities/perfil';
import { IServicePerfil } from '@app/services/interfaces/perfil';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { inject } from 'inversify';

@controller('/perfil')
export class ControllerPerfil extends BaseHttpController implements interfaces.Controller {
  private servicePerfil: IServicePerfil;

  constructor(
  @inject(TYPES.ServicePerfil) servicePerfil: IServicePerfil,
  ) {
    super();
  
    this.servicePerfil = servicePerfil;
  }

  @httpGet('/musicos', autenticado)
  private getMusicos(req: Request): Promise<Pagination<EntidadePerfil>> {
    const searchParameter: IPerfilSearchParameter = {
      generoMusical: req.query.generoMusical as string,
      especialidade: req.query.especialidade as string,
      nome: req.query.nome as string,
      cidade: req.query.cidade as string,
      estado: req.query.estado as string,
      valorMinimo: parseFloat(req.query.valorMinimo as string),
      valorMaximo: parseFloat(req.query.valorMaximo as string),
      pontuacaoAvaliacao: parseInt(req.query.pontuacaoAvaliacao as string),
    };

    return this.servicePerfil.getMusicosWithSearchParameters(searchParameter);
  }

}