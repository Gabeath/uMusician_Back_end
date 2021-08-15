import { Between, In } from 'typeorm';
import BusinessError, { ErrorCodes } from '@core/errors/business';
import { inject, injectable } from 'inversify';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryEvento } from '@core/repositories/interfaces/evento';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceServico } from '@app/services/interfaces/servico';
import { SituaçãoServiço } from '@core/models';
import TYPES from '@core/types';

@injectable()
export class ServiceServico implements IServiceServico {
  private repositoryServico: IRepositoryServico;
  private repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade;
  private repositoryEvento: IRepositoryEvento;

  constructor(
  @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
    @inject(TYPES.RepositoryApresentacaoEspecialidade)
    repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade,
    @inject(TYPES.RepositoryEvento) repositoryEvento: IRepositoryEvento,
  ) {
    this.repositoryServico = repositoryServico;
    this.repositoryApresentacaoEspecialidade = repositoryApresentacaoEspecialidade;
    this.repositoryEvento = repositoryEvento;
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

  async getServicosPendentesMusico(idMusico: string): Promise<EntidadeServico[]> {
    const apresentacoesEspecialidade = await this.repositoryApresentacaoEspecialidade
      .selectByIdMusicoWithEspecialidadeServico(idMusico);

    const listaIdServico: string[] = [];
    apresentacoesEspecialidade.forEach((apresentacao) => {
      apresentacao.especialidadesServico.forEach(servico => listaIdServico.push(servico.idServico));
    });

    const servicos = await this.repositoryServico.selectServicosPendentesMusico(listaIdServico);

    for (let i = 0; i < servicos.length; i += 1) {
      servicos[i].evento.contratante.usuario.senha = undefined;
    }

    return servicos;
  }

  async responderSolicitacaoServico(idServico: string, resposta: SituaçãoServiço, idMusico: string): Promise<void> {
    const servico = await this.repositoryServico.selectByIdWithEvento(idServico);

    if (!servico || (resposta !== SituaçãoServiço.ACEITO && resposta !== SituaçãoServiço.REJEITADO)) {
      throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);
    }

    const apresentacoesEspecialidade = await this.repositoryApresentacaoEspecialidade
      .selectByIdMusicoWithEspecialidadeServico(idMusico);

    const listaIdServico: string[] = [];
    apresentacoesEspecialidade.forEach((apresentacao) => {
      apresentacao.especialidadesServico.forEach(servico => listaIdServico.push(servico.idServico));
    });

    const servicos = await this.repositoryServico.selectAllByWhere({
      id: In(listaIdServico),
      situacao: SituaçãoServiço.ACEITO,
      deletedAt: null,
    });

    const evento = await this.repositoryEvento.selectOneByOptions({
      where: [
        {
          id: In(servicos.map(o => o.idEvento)),
          dataInicio: Between(servico.evento.dataInicio, servico.evento.dataTermino),
          deletedAt: null,
        },
        {
          id: In(servicos.map(o => o.idEvento)),
          dataTermino: Between(servico.evento.dataInicio, servico.evento.dataTermino),
          deletedAt: null,
        },
      ]
    });

    if (evento) {
      throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);
    }

    await this.repositoryServico.updateById(servico.id, {
      situacao: resposta,
      updatedBy: idMusico,
    });
  }
}