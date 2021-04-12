import { inject, injectable } from 'inversify';
import EntidadeUsuario from '@core/entities/usuario';
import { IRepositoryUsuario } from '@core/repositories/interfaces/usuario';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import TYPES from '@core/types';

@injectable()
export class ServiceUsuario implements IServiceUsuario {
  private repositoryUsuario: IRepositoryUsuario;

  constructor(
  @inject(TYPES.RepositoryUsuario) repositoryUsuario: IRepositoryUsuario,
  ) {
    this.repositoryUsuario = repositoryUsuario;
  }

  async criarUsuarioPerfil(usuario: EntidadeUsuario): Promise<EntidadeUsuario> {
    return usuario;
  }

  async buscarUsuario(email: string, senha: string, tipoPerfil: number): Promise<EntidadeUsuario>{
    const usuario = await this.repositoryUsuario.getByEmail(email);

    if(!usuario)
      throw new Error('Usuário não encontrado');
      
    if(usuario.senha !== senha)
      throw new Error('Senha incorreta');

    if(usuario.perfis.filter(perfil => perfil.categoria === tipoPerfil).length === 0)
      throw new Error('Usuário não possui o perfil selecionado');

    return usuario;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.repositoryUsuario.existsByEmail(email);
  }
  
  async existsByCPF(cpf: string): Promise<boolean> {
    return this.repositoryUsuario.existsByCPF(cpf);
  }
}