import { FindConditions, In, Repository, getRepository } from 'typeorm';
import { DateTime } from 'luxon';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { SituaçãoServiço } from '@core/models';
import { injectable } from 'inversify';

@injectable()
export class RepositoryServico implements IRepositoryServico {
  private repositoryServico: Repository<EntidadeServico> = getRepository(EntidadeServico);

  async create(servico: EntidadeServico): Promise<EntidadeServico> {
    return this.repositoryServico.save(servico);
  }

  async selectAllByWhere(where: FindConditions<EntidadeServico>): Promise<EntidadeServico[]> {
    return this.repositoryServico.find({
      where,
      relations: [
        'generosServico',
        'generosServico.apresentacaoGenero',
        'especialidadesServico',
        'especialidadesServico.apresentacaoEspecialidade',
      ],
    });
  }

  async selectById(id: string): Promise<EntidadeServico> {
    return this.repositoryServico.findOne({ where: { id } });
  }

  async selectByIdWithEvento(id: string): Promise<EntidadeServico> {
    return this.repositoryServico.findOne({
      where: { id },
      relations: ['evento'],
    });
  }

  async selectCompleteById(id: string): Promise<EntidadeServico> {
    return this.repositoryServico.findOne({
      where: { id },
      relations: [
        'avaliacao',
        'evento',
        'evento.contratante',
        'evento.contratante.usuario',
        'generosServico',
        'generosServico.apresentacaoGenero',
        'especialidadesServico',
        'especialidadesServico.apresentacaoEspecialidade',
      ],
    });
  }

  async selectServicosPendentesMusico(listaIdServico: string[]): Promise<EntidadeServico[]> {
    return this.repositoryServico.find({
      where: {
        id: In(listaIdServico),
        situacao: In([SituaçãoServiço.PENDENTE, SituaçãoServiço.ACEITO]),
        deletedAt: null,
      },
      relations: [
        'evento',
        'evento.contratante',
        'evento.contratante.usuario',
      ]
    });
  }

  async updateById(id: string, servico: QueryDeepPartialEntity<EntidadeServico>): Promise<void> {
    servico.updatedAt = DateTime.local().toISO();

    await this.repositoryServico.update(id, servico);
  }
}