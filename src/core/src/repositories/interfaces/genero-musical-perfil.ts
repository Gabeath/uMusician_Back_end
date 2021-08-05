import EntidadeApresentacaoGenero from '@core/entities/apresentacao-genero';

export interface IRepositoryGeneroMusicalPerfil {
  create(generoMusicalPerfil: EntidadeApresentacaoGenero[]):
  Promise<EntidadeApresentacaoGenero[]>;
  selectById(id: string): Promise<EntidadeApresentacaoGenero>;
}