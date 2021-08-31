import { FindConditions, FindOneOptions, Repository, getRepository } from 'typeorm';
import EntidadeEvento from '@core/entities/evento';
import { IRepositoryEvento } from '@core/repositories/interfaces/evento';
import { SituaçãoServiço } from '@core/models';
import { injectable } from 'inversify';

@injectable()
export class RepositoryEvento implements IRepositoryEvento {
  private repositoryEvento: Repository<EntidadeEvento> = getRepository(EntidadeEvento);

  async create(evento: EntidadeEvento): Promise<EntidadeEvento> {
    return this.repositoryEvento.save(evento);
  }

  async selectOneByOptions(options: FindOneOptions<EntidadeEvento>): Promise<EntidadeEvento> {
    return this.repositoryEvento.findOne(options);
  }

  async selectAllByWhere(where: FindConditions<EntidadeEvento>): Promise<EntidadeEvento[]> {
    return this.repositoryEvento.find({ where });
  }

  async selectCompleteById(id: string): Promise<EntidadeEvento> {
    return this.repositoryEvento.findOne({
      where: { id },
      relations: [
        'contratante',
        'contratante.usuario',
        'endereco',
        'servicos',
        'servicos.generosServico',
        'servicos.generosServico.apresentacaoGenero',
        'servicos.generosServico.apresentacaoGenero.generoMusical',
        'servicos.especialidadesServico',
        'servicos.especialidadesServico.apresentacaoEspecialidade',
        'servicos.especialidadesServico.apresentacaoEspecialidade.especialidade',
      ],
    });
  }

  async selectEventosContratante(idContratante: string, situacoesDosServicos: SituaçãoServiço[]):
  Promise<EntidadeEvento[]> {
    return this.repositoryEvento
      .createQueryBuilder('evento')
      .leftJoinAndSelect('evento.servicos', 'servicos')
      .leftJoinAndSelect('servicos.especialidadesServico', 'especialidadesServico')
      .leftJoinAndSelect('especialidadesServico.apresentacaoEspecialidade', 'apresentacaoEspecialidade')
      .where({
        idContratante,
        deletedAt: null,
      })
      .andWhere('servicos.situacao IN(:...situacoes)',
        { situacoes: situacoesDosServicos })
      .andWhere('servicos.deletedAt IS NULL')
      .getMany();
  }
}