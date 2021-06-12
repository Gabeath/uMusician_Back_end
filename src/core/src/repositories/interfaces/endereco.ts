import EntidadeEndereco from '@core/entities/endereco';

export interface IRepositoryEndereco {
  create(endereco: EntidadeEndereco): Promise<EntidadeEndereco>;
}