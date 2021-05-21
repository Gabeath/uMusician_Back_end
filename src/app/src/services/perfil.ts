import BusinessError, { ErrorCodes } from '@core/errors/business';
import { IPerfilSearchParameter, Pagination } from '@core/models';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import EntidadePerfil from '@core/entities/perfil';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IServicePerfil } from '@app/services/interfaces/perfil';
import TYPES from '@core/types';

@injectable()
export class ServicePerfil implements IServicePerfil {
  private repositoryPerfil: IRepositoryPerfil;
  private repositoryAvaliacao: IRepositoryAvaliacao;

  constructor(
  @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
    @inject(TYPES.RepositoryAvaliacao) repositoryAvaliacao: IRepositoryAvaliacao,
  ){
    this.repositoryPerfil = repositoryPerfil;
    this.repositoryAvaliacao = repositoryAvaliacao;
  }

  async getMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter):
  Promise<Pagination<EntidadePerfil>> {
    return this.repositoryPerfil.selectMusicosWithSearchParameters(searchParameter);
  }

  async getById(id: string): Promise<EntidadePerfil> {
    const perfil: EntidadePerfil = await this.repositoryPerfil.selectById(id);
    const avaliacao = await this.repositoryAvaliacao.selectMediaAvaliacoesMusico(perfil.id);
    perfil.usuario.senha = undefined;
    perfil.mediaAvaliacoes = avaliacao.media;
    return perfil;
  }

  async updateBiografiaById(id: string, biografia: string): Promise<void> {
    const perfil: EntidadePerfil = await this.repositoryPerfil.selectById(id);

    if (!perfil) {
      throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO);
    }

    await this.repositoryPerfil.updateById(perfil.id, {
      biografia,
      updatedAt: DateTime.local().toString(),
      updatedBy: perfil.id,
    } as EntidadePerfil);
  }
}