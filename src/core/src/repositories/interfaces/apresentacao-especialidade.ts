import EntidadeApresentacaoEspecialidade from '@core/entities/apresentacao-especialidade';

export interface IRepositoryApresentacaoEspecialidade {
  create(apresentacao: EntidadeApresentacaoEspecialidade[]):
  Promise<EntidadeApresentacaoEspecialidade[]>;
  selectById(id: string): Promise<EntidadeApresentacaoEspecialidade | null>;
  selectByIdMusicoWithEspecialidadeServico(idMusico: string): Promise<EntidadeApresentacaoEspecialidade[]>;
}