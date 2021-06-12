import EntidadeGeneroMusical from '@core/entities/genero-musical';

export interface IServiceGeneroMusical {
  getAll(): Promise<EntidadeGeneroMusical[]>;
}