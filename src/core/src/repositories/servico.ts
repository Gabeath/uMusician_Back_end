import { FindConditions, Repository, getRepository } from 'typeorm';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
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

  async selectCompleteById(id: string): Promise<EntidadeServico> {
    return this.repositoryServico.findOne({
      where: { id },
      relations: [
        'avaliacao',
        'evento',
        'generosServico',
        'especialidadesServico',
      ],
    });
  }
}