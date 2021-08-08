import { FindConditions, Repository, getRepository } from 'typeorm';
import { DateTime } from 'luxon';
import EntidadeUsuario from '@core/entities/usuario';
import { IRepositoryUsuario } from './interfaces/usuario';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { injectable } from 'inversify';

@injectable()
export class RepositoryUsuario implements IRepositoryUsuario {
  private repositoryUsuario: Repository<EntidadeUsuario> = getRepository(EntidadeUsuario);

  async create(usuario: EntidadeUsuario): Promise<EntidadeUsuario> {
    return this.repositoryUsuario.save(usuario);
  }

  async selectByEmailOrCpf(email: string, cpf: string): Promise<EntidadeUsuario | null> {
    return this.repositoryUsuario.findOne({
      where: [
        {
          email,
          deletedAt: null,
        },
        {
          cpf,
          deletedAt: null,
        },
      ],
    });
  }

  async selectByEmail(email: string): Promise<EntidadeUsuario | null> {
    return this.repositoryUsuario.findOne({
      where: {
        email
      },
      join: {
        alias: 'usuario',
        leftJoinAndSelect: {
          perfis: 'usuario.perfis',
        },
      },
    });
  }

  async selectByCpf(cpf: string): Promise<EntidadeUsuario | null> {
    return this.repositoryUsuario.findOne({
      where: {
        cpf,
      },
    });
  }

  async selectById(id: string): Promise<EntidadeUsuario | null> {
    return this.repositoryUsuario.findOne({
      where: {
        id,
      },
    });
  }

  async selectByIdWithProfiles(id: string): Promise<EntidadeUsuario | null> {
    return this.repositoryUsuario.findOne({
      where: {
        id,
      },
      join: {
        alias: 'usuario',
        leftJoinAndSelect: {
          perfis: 'usuario.perfis',
        },
      },
    });
  }

  async updateById(id: string, usuario: QueryDeepPartialEntity<EntidadeUsuario>): Promise<void> {
    usuario.updatedAt = DateTime.local().toISO();

    await this.repositoryUsuario.update(id, usuario);
  }

  async selectAllByWhere(where: FindConditions<EntidadeUsuario>): Promise<EntidadeUsuario[]> {
    return this.repositoryUsuario.find({ where });
  }
}