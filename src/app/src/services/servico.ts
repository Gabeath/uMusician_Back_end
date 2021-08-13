import BusinessError, { ErrorCodes } from '@core/errors/business';
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
    const servico = await this.repositoryServico.selectById(idServico);

    if (!servico || (resposta !== SituaçãoServiço.ACEITO && resposta !== SituaçãoServiço.REJEITADO)) {
      throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);
    }

    // const apresentacoesEspecialidade = await this.repositoryApresentacaoEspecialidade
    //   .selectByIdMusicoWithEspecialidadeServico(idMusico);

    // const listaIdServico: string[] = [];
    // apresentacoesEspecialidade.forEach((apresentacao) => {
    //   apresentacao.especialidadesServico.forEach(servico => listaIdServico.push(servico.idServico));
    // });

    await this.repositoryServico.updateById(servico.id, {
      situacao: resposta,
      updatedBy: idMusico,
    });
  }
}