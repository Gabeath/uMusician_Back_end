import EntidadeGeneroMusical from '@core/entities/genero-musical';

export interface IRepositoryGeneroMusical {
  selectAll(): Promise<EntidadeGeneroMusical[]>;
}