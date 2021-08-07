import { Repository, getRepository } from 'typeorm';
import EntidadeApresentacaoEspecialidade from '@core/entities/apresentacao-especialidade';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { injectable } from 'inversify';

@injectable()
export class RepositoryApresentacaoEspecialidade implements IRepositoryApresentacaoEspecialidade {
  private repositoryApresentacaoEspecialidade: Repository<EntidadeApresentacaoEspecialidade> =
  getRepository(EntidadeApresentacaoEspecialidade);

  async create(apresentacao: EntidadeApresentacaoEspecialidade[]):
  Promise<EntidadeApresentacaoEspecialidade[]> {
    return this.repositoryApresentacaoEspecialidade.save(apresentacao);
  }

  async selectById(id: string): Promise<EntidadeApresentacaoEspecialidade | null> {
    return this.repositoryApresentacaoEspecialidade.findOne({ where: { id } });
  }

  async selectByIdMusicoWithEspecialidadeServico(idMusico: string): Promise<EntidadeApresentacaoEspecialidade[]> {
    return this.repositoryApresentacaoEspecialidade.find({
      where: { idMusico },
      relations: ['especialidadesServico'],
    });
  }
}