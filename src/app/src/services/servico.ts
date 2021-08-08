import { inject, injectable } from 'inversify';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceServico } from '@app/services/interfaces/servico';
import { In } from 'typeorm';
import { SituaçãoServiço } from '@core/models';
import TYPES from '@core/types';

@injectable()
export class ServiceServico implements IServiceServico {
  private repositoryServico: IRepositoryServico;
  private repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade;

  constructor(
  @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
    @inject(TYPES.RepositoryApresentacaoEspecialidade)
    repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade,
  ) {
    this.repositoryServico = repositoryServico;
    this.repositoryApresentacaoEspecialidade = repositoryApresentacaoEspecialidade;
  }

  async getDetalhesServico(id: string): Promise<EntidadeServico> {
    return this.repositoryServico.selectCompleteById(id);
  }

  async countServicosConcluidos(idMusico: string): Promise<number> {
    const apresentacoesEspecialidade = await this.repositoryApresentacaoEspecialidade
      .selectByIdMusicoWithEspecialidadeServico(idMusico);

    const listaIdServico: string[] = [];
    apresentacoesEspecialidade.forEach((apresentacao) => {
      apresentacao.especialidadesServico.forEach(servico => listaIdServico.push(servico.idServico));
    });

    const servicos = await this.repositoryServico.selectAllByWhere({
      id: In(listaIdServico),
      situacao: SituaçãoServiço.CONCLUÍDO,
      deletedAt: null,
    });

    return servicos.length;
  }
}