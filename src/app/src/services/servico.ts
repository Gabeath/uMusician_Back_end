import { Between, In } from 'typeorm';
import BusinessError, { ErrorCodes } from '@core/errors/business';
import { IServicoSearchParameter, SituaçãoServiço } from '@core/models';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryEvento } from '@core/repositories/interfaces/evento';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceServico } from '@app/services/interfaces/servico';
import TYPES from '@core/types';

@injectable()
export class ServiceServico implements IServiceServico {
  private repositoryServico: IRepositoryServico;
  private repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade;
  private repositoryEvento: IRepositoryEvento;
  private repositoryPerfil: IRepositoryPerfil;

  constructor(
  @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
    @inject(TYPES.RepositoryApresentacaoEspecialidade)
    repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade,
    @inject(TYPES.RepositoryEvento) repositoryEvento: IRepositoryEvento,
    @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
  ) {
    this.repositoryServico = repositoryServico;
    this.repositoryApresentacaoEspecialidade = repositoryApresentacaoEspecialidade;
    this.repositoryEvento = repositoryEvento;
    this.repositoryPerfil = repositoryPerfil;
  }

  async getDetalhesServico(id: string): Promise<EntidadeServico> {
    const servico = await this.repositoryServico.selectCompleteById(id);

    if (!servico) { throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS); }

    const musico = await this.repositoryPerfil
      .selectById(servico.especialidadesServico[0].apresentacaoEspecialidade.idMusico);

    servico.musico = musico;
    servico.musico.usuario.senha = undefined;
    servico.evento.contratante.usuario.senha = undefined;

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

  async getServicosMusico(idMusico: string, searchParameter: IServicoSearchParameter): Promise<EntidadeServico[]> {
    const apresentacoesEspecialidade = await this.repositoryApresentacaoEspecialidade
      .selectByIdMusicoWithEspecialidadeServico(idMusico);

    const listaIdServico: string[] = [];
    apresentacoesEspecialidade.forEach((apresentacao) => {
      apresentacao.especialidadesServico.forEach(servico => listaIdServico.push(servico.idServico));
    });

    const servicos = await this.repositoryServico.selectServicosMusico({
      ...searchParameter,
      listaIdServico,
    });

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

    if (resposta === SituaçãoServiço.ACEITO) {
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
        throw new BusinessError(ErrorCodes.CONFLITO_HORARIO);
      }
    }

    await this.repositoryServico.updateById(servico.id, {
      situacao: resposta,
      updatedBy: idMusico,
    });
  }

  async musicoCancelarServico(idServico: string, idMusico: string): Promise<void> {
    const servico = await this.repositoryServico.selectByIdWithEvento(idServico);

    if (!servico) { throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS); }

    const dataServico = DateTime.fromJSDate(servico.evento.dataInicio as Date);
    if (dataServico.diffNow('day').days <= 2) {
      throw new BusinessError(ErrorCodes.LIMITE_CANCELAMENTO_ESTOURADO);
    }

    await this.repositoryServico.updateById(servico.id, {
      situacao: SituaçãoServiço.CANCELADO,
      updatedBy: idMusico,
    });
  }

  async contratanteCancelarServico(idServico: string, idContratante: string): Promise<void> {
    const servico = await this.repositoryServico.selectByIdWithEvento(idServico);

    if (!servico) { throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS); }

    const dataServico = DateTime.fromJSDate(servico.evento.dataInicio as Date);
    if (dataServico.diffNow('day').days <= 1) {
      throw new BusinessError(ErrorCodes.LIMITE_CANCELAMENTO_ESTOURADO);
    }

    await this.repositoryServico.updateById(servico.id, {
      situacao: SituaçãoServiço.CANCELADO,
      updatedBy: idContratante,
    });
  }
}