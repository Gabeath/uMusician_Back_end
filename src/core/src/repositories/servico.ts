import { FindConditions, In, Repository, getRepository } from 'typeorm';
import { DateTime } from 'luxon';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServicoSearchParameter } from '@core/models';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
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

  async selectServicosMusico(searchParameter: IServicoSearchParameter):
  Promise<EntidadeServico[]> {
    return this.repositoryServico
      .createQueryBuilder('servico')
      .leftJoinAndSelect('servico.evento', 'evento')
      .leftJoinAndSelect('servico.avaliacao', 'avaliacao')
      .leftJoinAndSelect('evento.contratante', 'contratante')
      .leftJoinAndSelect('contratante.usuario', 'usuario')
      .where({
        id: In(searchParameter.listaIdServico),
        situacao: In(searchParameter.situacoesDosServicos),
        deletedAt: null,
      })
      .orderBy(`${searchParameter.orderBy || 'servico.createdAt'}`, searchParameter.isDESC ? 'DESC' : 'ASC')
      .getMany();
  }

  async updateById(id: string, servico: QueryDeepPartialEntity<EntidadeServico>): Promise<void> {
    servico.updatedAt = DateTime.local().toISO();

    await this.repositoryServico.update(id, servico);
  }
}