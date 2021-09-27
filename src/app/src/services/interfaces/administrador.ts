import EntidadeAdmin from '@core/entities/administrador';

export interface IServiceAdmin {
  criarAdmin(admin: EntidadeAdmin): Promise<EntidadeAdmin>;
  buscarAdmin(email: string, senha: string): Promise<EntidadeAdmin>;
}