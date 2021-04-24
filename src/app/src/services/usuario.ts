import BusinessError, { ErrorCodes } from  '@core/errors/business';
import { CategoriaPerfil, SituaçãoPerfil } from '@core/models/enumerators';
import { inject, injectable } from 'inversify';
import EntidadeApresentacao from '@core/entities/apresentacao';
import EntidadeGeneroMusicalPerfil from '@core/entities/genero-musical-perfil';
import EntidadePerfil from '@core/entities/perfil';
import EntidadeUsuario from '@core/entities/usuario';
import { IRepositoryApresentacao } from '@core/repositories/interfaces/apresentacao';
import {
  IRepositoryGeneroMusicalPerfil
} from '@core/repositories/interfaces/genero-musical-perfil';
import { IRepositoryUsuario } from '@core/repositories/interfaces/usuario';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import TYPES from '@core/types';
import { cryptToken } from '@app/utils/tokens';

@injectable()
export class ServiceUsuario implements IServiceUsuario {
  private repositoryUsuario: IRepositoryUsuario;
  private repositoryApresentacao: IRepositoryApresentacao;
  private repositoryGeneroMusicalPerfil: IRepositoryGeneroMusicalPerfil;

  constructor(
  @inject(TYPES.RepositoryUsuario) repositoryUsuario: IRepositoryUsuario,
    @inject(TYPES.RepositoryApresentacao) repositoryApresentacao: IRepositoryApresentacao,
    @inject(TYPES.RepositoryGeneroMusicalPerfil)
    repositoryGeneroMusicalPerfil: IRepositoryGeneroMusicalPerfil,
  ) {
    this.repositoryUsuario = repositoryUsuario;
    this.repositoryApresentacao = repositoryApresentacao;
    this.repositoryGeneroMusicalPerfil = repositoryGeneroMusicalPerfil;
  }

  async criarUsuarioPerfil(usuario: EntidadeUsuario): Promise<EntidadeUsuario> {
    const existe: EntidadeUsuario = await this.repositoryUsuario
      .selectByEmailOrCpf(usuario.email, usuario.cpf);

    if (existe)
      throw new BusinessError(ErrorCodes.USUARIO_JA_CADASTRADO);

    const senhaEncriptada: string = cryptToken(usuario.senha);

    const usuarioToSave: EntidadeUsuario = {
      email: usuario.email,
      senha: senhaEncriptada,
      nome: usuario.nome,
      cpf: usuario.cpf,
      genero: usuario.genero,
      dataNascimento: usuario.dataNascimento,
    };

    const perfilToSave: EntidadePerfil = {
      categoria: usuario.perfis[0].categoria,
      cidade: usuario.perfis[0].cidade,
      estado: usuario.perfis[0].estado,
      biografia: usuario.perfis[0].biografia,
      situacao: SituaçãoPerfil.ATIVO,
    };

    const usuarioSaved: EntidadeUsuario =
    await this.repositoryUsuario.criarUsuarioPerfil(usuarioToSave, perfilToSave);

    if (usuario.perfis[0].categoria === CategoriaPerfil.MUSICO) {
      const apresentacoes: EntidadeApresentacao[] = usuario.perfis[0].apresentacoes.map(
        (apresentacao: EntidadeApresentacao) => {
          return {
            ...apresentacao,
            idPerfil: usuarioSaved.perfis[0].id,
          };
        }
      );
      const generosMusicais: EntidadeGeneroMusicalPerfil[] = usuario.perfis[0].generosMusicais.map(
        (generoMusical: EntidadeGeneroMusicalPerfil) => {
          return {
            ...generoMusical,
            idPerfil: usuarioSaved.perfis[0].id,
          };
        }
      );
      const apresentacoesSalvas: EntidadeApresentacao[] =
      await this.repositoryApresentacao.create(apresentacoes);
      const generosMusicaisSalvas: EntidadeGeneroMusicalPerfil[] = 
      await this.repositoryGeneroMusicalPerfil.create(generosMusicais);

      usuarioSaved.perfis[0].apresentacoes = apresentacoesSalvas;
      usuarioSaved.perfis[0].generosMusicais = generosMusicaisSalvas;
    }

    return usuarioSaved;
  }

  async buscarUsuario(email: string, senha: string, tipoPerfil: number): Promise<EntidadeUsuario>{
    const usuario = await this.repositoryUsuario.selectByEmail(email);
    const senhaCriptografada = cryptToken(senha);

    if(!usuario || usuario.senha !== senhaCriptografada)
      throw new BusinessError(ErrorCodes.DADOS_LOGIN_INVALIDOS);

    if(usuario.perfis.filter(perfil => perfil.categoria === tipoPerfil).length === 0)
      throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO);

    return usuario;
  }

  async validaUsuarioExistente(email: string, cpf: string):
  Promise<{ valido: boolean, mensagem?: string }> {
    const existeEmail: EntidadeUsuario = await this.repositoryUsuario.selectByEmail(email);

    if (existeEmail) {
      return { valido: false, mensagem: 'email_em_uso' };
    }

    const existeCpf: EntidadeUsuario = await this.repositoryUsuario.selectByCpf(cpf);

    if (existeCpf) {
      return { valido: false, mensagem: 'cpf_em_uso' };
    }

    return { valido: true, mensagem: null };
  }
}