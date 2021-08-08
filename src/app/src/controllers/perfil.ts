import {
  BaseHttpController,
  controller,
  httpGet,
  httpPut,
  interfaces
} from 'inversify-express-utils';
import { IMusicoSearchParameter, Pagination } from '@core/models/pagination';
import { CategoriaPerfil } from '@core/models';
import EntidadePerfil from '@core/entities/perfil';
import { IServicePerfil } from '@app/services/interfaces/perfil';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { controllerPaginationHelper } from '@app/utils/pagination';
import { inject } from 'inversify';
import isPerfilPermitido from '@app/middlewares/perfil';

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
    const searchParameter: IMusicoSearchParameter = {
      ...controllerPaginationHelper(req.query),
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

  @httpGet('/:id', autenticado)
  private getById(req: Request): Promise<EntidadePerfil> {
    return this.servicePerfil.getById(req.params.id);
  }

  @httpPut('/biografia', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async updateBiografiaById(req: Request): Promise<void> {
    const biografia = req.body.biografia as string;
    await this.servicePerfil.updateBiografiaById(req.session.profileID, biografia);
  }
}