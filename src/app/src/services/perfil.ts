import { Between, In } from 'typeorm';
import BusinessError, { ErrorCodes } from '@core/errors/business';
import { CategoriaPerfil, IMusicoSearchParameter, Pagination } from '@core/models';
import { inject, injectable } from 'inversify';
import EntidadePerfil from '@core/entities/perfil';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryApresentacaoGenero } from '@core/repositories/interfaces/apresentacao-genero';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryUsuario } from '@core/repositories/interfaces/usuario';
import { IServiceAvaliacao } from './interfaces/avaliacao';
import { IServicePerfil } from '@app/services/interfaces/perfil';
import { IServiceServico } from './interfaces/servico';
import TYPES from '@core/types';

@injectable()
export class ServicePerfil implements IServicePerfil {
  private repositoryPerfil: IRepositoryPerfil;
  private repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade;
  private repositoryApresentacaoGenero: IRepositoryApresentacaoGenero;
  private repositoryUsuario: IRepositoryUsuario;
  private serviceAvaliacao: IServiceAvaliacao;
  private serviceServico: IServiceServico;

  constructor(
  @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
    @inject(TYPES.RepositoryApresentacaoEspecialidade)
    repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade,
    @inject(TYPES.RepositoryApresentacaoGenero) repositoryApresentacaoGenero: IRepositoryApresentacaoGenero,
    @inject(TYPES.RepositoryUsuario) repositoryUsuario: IRepositoryUsuario,
    @inject(TYPES.ServiceAvaliacao) serviceAvaliacao: IServiceAvaliacao,
    @inject(TYPES.ServiceServico) serviceServico: IServiceServico,
  ) {
    this.repositoryPerfil = repositoryPerfil;
    this.repositoryApresentacaoEspecialidade = repositoryApresentacaoEspecialidade;
    this.repositoryApresentacaoGenero = repositoryApresentacaoGenero;
    this.repositoryUsuario = repositoryUsuario;
    this.serviceAvaliacao = serviceAvaliacao;
    this.serviceServico = serviceServico;
  }

  async getMusicosWithSearchParameters(searchParameter: IMusicoSearchParameter):
  Promise<Pagination<EntidadePerfil>> {
    let listaIdMusico: string[];

    if (searchParameter.generoMusical) {
      const apresentacoesGenero = await this.repositoryApresentacaoGenero
        .selectAllByIdGenero(searchParameter.generoMusical);

      const listaIdMusicoGenero = apresentacoesGenero.map(o => o.idMusico);
      listaIdMusico = listaIdMusicoGenero;
    }

    if (searchParameter.especialidade
      || searchParameter.valorMinimo
      || searchParameter.valorMaximo) {
      const apresentacoesEspecialidade = await this.repositoryApresentacaoEspecialidade
        .selectAllByWhere({
          ...(listaIdMusico && { idEspecialidade: In(listaIdMusico) }),
          ...(searchParameter.especialidade && { id: searchParameter.especialidade }),
          valorHora: Between(
            searchParameter.valorMinimo || 0,
            searchParameter.valorMaximo || Number.MAX_SAFE_INTEGER,
          ),
          deletedAt: null,
        });

      const listaIdMusicoEspecialidade = apresentacoesEspecialidade.map(o => o.idMusico);
      listaIdMusico = listaIdMusicoEspecialidade;
    }

    if (listaIdMusico) { searchParameter.listaIdMusico = listaIdMusico; }

    const musicos = await this.repositoryPerfil.selectMusicosWithSearchParameters(searchParameter);

    for (let i = 0; i < musicos.rows.length; i +=1) {
      musicos.rows[i].avaliacaoMedia = await this.serviceAvaliacao.getAvaliacaoMedia(musicos.rows[i].id);
      musicos.rows[i].usuario.senha = undefined;
    }

    if (searchParameter.pontuacaoAvaliacao) {
      musicos.rows = musicos.rows.filter(o => o.avaliacaoMedia >= searchParameter.pontuacaoAvaliacao);
      musicos.count = musicos.rows.length;
    }

    return musicos;
  }

  async getById(id: string): Promise<EntidadePerfil> {
    const perfil = await this.repositoryPerfil.selectCompleteById(id);

    perfil.usuario.senha = undefined;

    if (perfil.categoria === CategoriaPerfil.MUSICO) {
      const avaliacaoMedia = await this.serviceAvaliacao.getAvaliacaoMedia(perfil.id);
      perfil.avaliacaoMedia = parseInt(avaliacaoMedia.toFixed(1), 10);
      perfil.countServicos = await this.serviceServico.countServicosConcluidos(perfil.id);
    }

    return perfil;
  }

  async updateBiografiaById(id: string, biografia: string): Promise<void> {
    const musico = await this.repositoryPerfil.selectById(id);

    if (!musico) {
      throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO);
    }

    await this.repositoryPerfil.updateById(musico.id, {
      biografia,
      updatedBy: musico.id,
    });
  }
}