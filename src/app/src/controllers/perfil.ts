import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  interfaces
} from 'inversify-express-utils';
import { IMusicoSearchParameter, Pagination } from '@core/models/pagination';
import { CategoriaPerfil } from '@core/models';
import EntidadeApresentacaoEspecialidade from '@core/entities/apresentacao-especialidade';
import EntidadeApresentacaoGenero from '@core/entities/apresentacao-genero';
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

  @httpPut('/:idApresentacaoGenero/genero-musical', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async updateApresentacaoGenero(req: Request): Promise<void> {
    await this.servicePerfil.updateApresentacaoGenero(
      req.params.idApresentacaoGenero,
      req.body as EntidadeApresentacaoGenero,
      req.session.profileID,
    );
  }

  @httpPut('/:idApresentacaoEspecialidade/especialidade', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async updateApresentacaoEspecialidade(req: Request): Promise<void> {
    await this.servicePerfil.updateApresentacaoEspecialidade(
      req.params.idApresentacaoEspecialidade,
      req.body as EntidadeApresentacaoEspecialidade,
      req.session.profileID,
    );
  }

  @httpPut('/biografia', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async updateBiografiaById(req: Request): Promise<void> {
    const biografia = req.body.biografia as string;
    await this.servicePerfil.updateBiografiaById(req.session.profileID, biografia);
  }

  @httpPost('/genero-musical', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async addApresentacaoGenero(req: Request): Promise<EntidadeApresentacaoGenero> {
    return this.servicePerfil.addApresentacaoGenero(req.body as EntidadeApresentacaoGenero, req.session.profileID);
  }

  @httpPost('/especialidade', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async addApresentacaoEspecialidade(req: Request): Promise<EntidadeApresentacaoEspecialidade> {
    return this.servicePerfil.addApresentacaoEspecialidade(
      req.body as EntidadeApresentacaoEspecialidade,
      req.session.profileID,
    );
  }

  @httpDelete('/:idApresentacaoGenero/genero-musical', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async deleteApresentacaoGenero(req: Request): Promise<void> {
    await this.servicePerfil.deleteApresentacaoGenero(req.params.idApresentacaoGenero, req.session.profileID);
  }
}