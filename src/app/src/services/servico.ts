import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceServico } from '@app/services/interfaces/servico';
import { SituaçãoServiço } from '@core/models';
import TYPES from '@core/types';

@injectable()
export class ServiceServico implements IServiceServico {
  private repositoryServico: IRepositoryServico;

  constructor(
  @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
  ) {
    this.repositoryServico = repositoryServico;
  }

  async create(idContratante: string, servico: EntidadeServico): Promise<EntidadeServico> {
    const servicoToSave: EntidadeServico = {
      situacao: SituaçãoServiço.PENDENTE,
      dataInicio: servico.dataInicio,
      dataTermino: servico.dataTermino,
      idApresentacao: '',
      idContratante: '',
    };

    return this.repositoryServico.create(servicoToSave);
  }
}