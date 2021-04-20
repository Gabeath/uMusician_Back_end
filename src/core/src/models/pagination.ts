export type Pagination<T> = {
  rows: T[];
  count: number;
};

export type SearchParameterBase = {
  offset?: number;
  orderBy?: string;
  isDESC?: boolean;
  limit?: number;
};

export interface IPerfilSearchParameter extends SearchParameterBase {
  generoMusical?: string;
  especialidade?: string;
  cidade?: string;
  estado?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  pontuacaoAvaliacao?: number;
}