export interface Pagination<T> {
  rows: T[];
  count: number;
}

export interface SearchParameterBase {
  offset?: number;
  orderBy?: string;
  isDESC?: boolean;
  limit?: number;
}

export interface IMusicoSearchParameter extends SearchParameterBase {
  generoMusical?: string;
  especialidade?: string;
  nome?: string;
  cidade?: string;
  estado?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  pontuacaoAvaliacao?: number;
  listaIdMusico?: string[];
  listaIdUsuario?: string[];
}