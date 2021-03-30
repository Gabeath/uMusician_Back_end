export type Pagination<T> = {
  rows: T[];
  count: number;
};

export type SearchParameterBase = {
  offset: number;
  orderBy: string;
  isDESC: boolean;
  limit: number;
};