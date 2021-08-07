import BusinessError, { ErrorCodes } from '@core/errors/business';
import { Pagination, SearchParameterBase } from '@core/models';
import { inject, injectable } from 'inversify';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IServiceAvaliacao } from '@app/services/interfaces/avaliacao';
import TYPES from '@core/types';

@injectable()
export class ServiceAvaliacao implements IServiceAvaliacao {
  private repositoryAvaliacao: IRepositoryAvaliacao;
  private repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade;
  private repositoryPerfil: IRepositoryPerfil;

  constructor(
  @inject(TYPES.RepositoryAvaliacao) repositoryAvaliacao: IRepositoryAvaliacao,
    @inject(TYPES.RepositoryApresentacaoEspecialidade)
    repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade,
    @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
  ) {
    this.repositoryAvaliacao = repositoryAvaliacao;
    this.repositoryApresentacaoEspecialidade = repositoryApresentacaoEspecialidade;
    this.repositoryPerfil = repositoryPerfil;
  }

  async getAvaliacoesPaginated(idMusico: string, searchParameter: SearchParameterBase):
  Promise<Pagination<EntidadeAvaliacao>> {
    const musico = await this.repositoryPerfil.selectById(idMusico);

    if (!musico) { throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO); }

    const apresentacoesEspecialidade = await this.repositoryApresentacaoEspecialidade
      .selectByIdMusicoWithEspecialidadeServico(musico.id);

    const listaIdServico: string[] = [];
    apresentacoesEspecialidade.forEach((apresentacao) => {
      apresentacao.especialidadesServico.forEach(servico => listaIdServico.push(servico.idServico));
    });

    return this.repositoryAvaliacao.selectAvaliacoesPaginated(listaIdServico, searchParameter);
  }
}