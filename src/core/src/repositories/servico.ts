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
    return this.repositoryServico.find(where);
  }

  async selectById(id: string): Promise<EntidadeServico | null> {
    return this.repositoryServico.findOne({
      where: { id },
      relations: [
        'apresentacao',
        'apresentacao.especialidade',
        'apresentacao.perfil',
        'apresentacao.perfil.usuario',
        'generoMusicalPerfil',
        'generoMusicalPerfil.generoMusical',
        'contratante',
        'contratante.usuario',
        'endereco',
      ],
    });
  }
}