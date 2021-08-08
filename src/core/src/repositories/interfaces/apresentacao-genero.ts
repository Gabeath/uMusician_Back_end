import EntidadeApresentacaoGenero from '@core/entities/apresentacao-genero';

export interface IRepositoryApresentacaoGenero {
  create(generoMusicalPerfil: EntidadeApresentacaoGenero[]):
  Promise<EntidadeApresentacaoGenero[]>;
  selectById(id: string): Promise<EntidadeApresentacaoGenero>;
  selectAllByIdGenero(idGeneroMusical: string): Promise<EntidadeApresentacaoGenero[]>;
}