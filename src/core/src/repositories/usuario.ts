import { Repository, getConnection, getRepository } from 'typeorm';
import EntidadePerfil from '@core/entities/perfil';
import EntidadeUsuario from '@core/entities/usuario';
import { IRepositoryUsuario } from './interfaces/usuario';
import PersistentError from '@core/errors/persistent';
import { injectable } from 'inversify';

@injectable()
export class RepositoryUsuario implements IRepositoryUsuario {
  private repositoryUsuario: Repository<EntidadeUsuario> = getRepository(EntidadeUsuario);
  private repositoryPerfil: Repository<EntidadePerfil> = getRepository(EntidadePerfil);

  async criarUsuarioPerfil(usuario: EntidadeUsuario, perfil: EntidadePerfil):
  Promise<EntidadeUsuario> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let resposta: EntidadeUsuario;
    try {
      const usuarioSaved: EntidadeUsuario = await this.repositoryUsuario.save(usuario);
      const perfilSaved: EntidadePerfil = await this.repositoryPerfil.save({
        ...perfil,
        idUsuario: usuarioSaved.id,
      });

      resposta = {
        ...usuarioSaved,
        perfis: [perfilSaved],
      };

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new PersistentError(err);
    } finally {
      await queryRunner.release();
    }

    return resposta;
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

  async getByEmail(email: string): Promise<EntidadeUsuario>{
    return this.repositoryUsuario.findOne({
      where: {
        email
      },
      relations: ['perfis']
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const usuario = await this.repositoryUsuario.findOne({
      where: {
        email
      },
      select: ['email']
    });

    if(!usuario)
      return false;
    
    return true;
  }
  async existsByCPF(cpf: string): Promise<boolean> {
    const usuario = await this.repositoryUsuario.findOne({
      where: {
        cpf
      },
      select: ['email']
    });

    if(!usuario)
      return false;
    
    return true;
  }
}