import EntidadeApresentacao from '@core/entities/apresentacao';

export interface IRepositoryApresentacao {
  create(apresentacao: EntidadeApresentacao[]): Promise<EntidadeApresentacao[]>;
  selectById(id: string): Promise<EntidadeApresentacao | null>;
}