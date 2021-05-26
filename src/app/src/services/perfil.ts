import BusinessError, { ErrorCodes } from '@core/errors/business';
import { IPerfilSearchParameter, Pagination } from '@core/models';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import EntidadePerfil from '@core/entities/perfil';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServicePerfil } from '@app/services/interfaces/perfil';
import TYPES from '@core/types';

@injectable()
export class ServicePerfil implements IServicePerfil {
  private repositoryPerfil: IRepositoryPerfil;
  private repositoryAvaliacao: IRepositoryAvaliacao;
  private repositoryServico: IRepositoryServico;

  constructor(
  @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
    @inject(TYPES.RepositoryAvaliacao) repositoryAvaliacao: IRepositoryAvaliacao,
    @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
  ){
    this.repositoryPerfil = repositoryPerfil;
    this.repositoryAvaliacao = repositoryAvaliacao;
    this.repositoryServico = repositoryServico;
  }

  async getMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter):
  Promise<Pagination<EntidadePerfil>> {
    return this.repositoryPerfil.selectMusicosWithSearchParameters(searchParameter);
  }

  async getById(id: string): Promise<EntidadePerfil> {
    const perfil: EntidadePerfil = await this.repositoryPerfil.selectById(id);

    const idApresentacoes: string[] = perfil.apresentacoes.map((apresentacao) => {
      return apresentacao.id;
    });
    const servico: { count: number } =
    await this.repositoryServico.countServicosMusico(idApresentacoes);

    const avaliacao: { media: number } =
    await this.repositoryAvaliacao.selectMediaAvaliacoesMusico(perfil.id);

    perfil.usuario.senha = undefined;
    perfil.avaliacaoMedia = avaliacao.media;
    perfil.countServicos = servico.count;

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