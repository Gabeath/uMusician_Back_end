import EntidadeGeneroServico from '@core/entities/genero-servico';

export interface IRepositoryGeneroServico {
  create(generoServico: EntidadeGeneroServico): Promise<EntidadeGeneroServico>;
}