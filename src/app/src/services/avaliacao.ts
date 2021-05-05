import { Pagination, SearchParameterBase } from '@core/models';
import { inject, injectable } from 'inversify';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { IServiceAvaliacao } from '@app/services/interfaces/avaliacao';
import TYPES from '@core/types';

@injectable()
export class ServiceAvaliacao implements IServiceAvaliacao {
  private repositoryAvaliacao: IRepositoryAvaliacao;

  constructor(
  @inject(TYPES.RepositoryAvaliacao) repositoryAvaliacao: IRepositoryAvaliacao,
  ) {
    this.repositoryAvaliacao = repositoryAvaliacao;
  }

  async getAvaliacoesPaginated(idPerfil: string, searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>> {
    return this.repositoryAvaliacao.selectAvaliacoesPaginated(idPerfil, searchParameter);
  }
}