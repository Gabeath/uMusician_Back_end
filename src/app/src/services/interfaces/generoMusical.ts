import EntidadeGeneroMusical from '@core/entities/genero-musical';

export interface IServiceGeneroMusical {
  getAll(): Promise<EntidadeGeneroMusical[]>;
  addGeneroMusical(nome: string, popularidade: number, idSolicitacao: string, filename: string) :
  Promise<EntidadeGeneroMusical>;
}