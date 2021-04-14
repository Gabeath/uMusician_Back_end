import EntidadeGeneroMusicalPerfil from '@core/entities/genero-musical-perfil';

export interface IRepositoryGeneroMusicalPerfil {
  create(generoMusicalPerfil: EntidadeGeneroMusicalPerfil[]):
  Promise<EntidadeGeneroMusicalPerfil[]>;
}