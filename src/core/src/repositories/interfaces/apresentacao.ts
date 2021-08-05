import EntidadeApresentacaoEspecialidade from '@core/entities/apresentacao-especialidade';

export interface IRepositoryApresentacao {
  create(apresentacao: EntidadeApresentacaoEspecialidade[]):
  Promise<EntidadeApresentacaoEspecialidade[]>;
  selectById(id: string): Promise<EntidadeApresentacaoEspecialidade | null>;
}