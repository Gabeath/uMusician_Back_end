import EntidadeGeneroServico from '@core/entities/genero-servico';

export interface IRepositoryGeneroServico {
  create(generosServico: EntidadeGeneroServico[]): Promise<EntidadeGeneroServico[]>;
}