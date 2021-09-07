import BusinessError, { ErrorCodes } from '@core/errors/business';
import { Pagination, SearchParameterBase } from '@core/models';
import { inject, injectable } from 'inversify';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceAvaliacao } from '@app/services/interfaces/avaliacao';
import TYPES from '@core/types';

@injectable()
export class ServiceAvaliacao implements IServiceAvaliacao {
  private repositoryAvaliacao: IRepositoryAvaliacao;
  private repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade;
  private repositoryPerfil: IRepositoryPerfil;
  private repositoryServico: IRepositoryServico;

  constructor(
  @inject(TYPES.RepositoryAvaliacao) repositoryAvaliacao: IRepositoryAvaliacao,
    @inject(TYPES.RepositoryApresentacaoEspecialidade)
    repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade,
    @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
    @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
  ) {
    this.repositoryAvaliacao = repositoryAvaliacao;
    this.repositoryApresentacaoEspecialidade = repositoryApresentacaoEspecialidade;
    this.repositoryPerfil = repositoryPerfil;
    this.repositoryServico = repositoryServico;
  }

  async create(avaliacao: EntidadeAvaliacao, idContratante: string): Promise<EntidadeAvaliacao> {
    const servico = await this.repositoryServico.selectCompleteById(avaliacao.idServico);

    if (!servico) { throw new BusinessError(ErrorCodes.SERVICO_NAO_ENCONTRADO); }

    const existe = await this.repositoryAvaliacao.selectByIdServico(servico.id);

    if (existe) { throw new BusinessError(ErrorCodes.SERVICO_JA_AVALIADO); }

    return this.repositoryAvaliacao.create({
      idServico: servico.id,
      pontuacao: avaliacao.pontuacao,
      comentario: avaliacao.comentario,
      idMusico: servico.especialidadesServico[0].apresentacaoEspecialidade.idMusico,
      createdBy: idContratante,
    });
  }

  async getAvaliacoesPaginated(idMusico: string, searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>> {
    return this.repositoryAvaliacao.selectAvaliacoesPaginated(idMusico, searchParameter);
  }

  async getAvaliacaoMedia(idMusico: string): Promise<number> {
    return this.repositoryAvaliacao.selectMediaAvaliacoesMusico(idMusico);
  }

  async getMediasAvaliacoesMusico(pontuacao: number): Promise<{ media: number, idMusico: string }[]> {
    return this.repositoryAvaliacao.selectMediasAvaliacoesMusico(pontuacao);
  }
}