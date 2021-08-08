import BusinessError, { ErrorCodes } from  '@core/errors/business';
import { CategoriaPerfil, SituaçãoPerfil } from '@core/models/enumerators';
import { inject, injectable } from 'inversify';
import EntidadeUsuario from '@core/entities/usuario';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryApresentacaoGenero } from '@core/repositories/interfaces/apresentacao-genero';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryUsuario } from '@core/repositories/interfaces/usuario';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import TYPES from '@core/types';
import { cryptToken } from '@app/utils/tokens';

@injectable()
export class ServiceUsuario implements IServiceUsuario {
  private repositoryUsuario: IRepositoryUsuario;
  private repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade;
  private repositoryApresentacaoGenero: IRepositoryApresentacaoGenero;
  private repositoryPerfil: IRepositoryPerfil;

  constructor(
  @inject(TYPES.RepositoryUsuario) repositoryUsuario: IRepositoryUsuario,
    @inject(TYPES.RepositoryApresentacaoEspecialidade)
    repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade,
    @inject(TYPES.RepositoryApresentacaoGenero)
    repositoryApresentacaoGenero: IRepositoryApresentacaoGenero,
    @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
  ) {
    this.repositoryUsuario = repositoryUsuario;
    this.repositoryApresentacaoEspecialidade = repositoryApresentacaoEspecialidade;
    this.repositoryApresentacaoGenero = repositoryApresentacaoGenero;
    this.repositoryPerfil = repositoryPerfil;
  }

  async criarUsuarioPerfil(usuario: EntidadeUsuario): Promise<EntidadeUsuario> {
    const existe: EntidadeUsuario = await this.repositoryUsuario
      .selectByEmailOrCpf(usuario.email, usuario.cpf);

    if (existe) { throw new BusinessError(ErrorCodes.USUARIO_JA_CADASTRADO); }

    if (!usuario.perfis || usuario.perfis.length <= 0) {
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);
    }

    if (usuario.perfis[0].categoria === CategoriaPerfil.MUSICO && (
      !usuario.perfis[0].apresentacoesEspecialidade || !usuario.perfis[0].apresentacoesGenero
      || usuario.perfis[0].apresentacoesEspecialidade.length <= 0
      || usuario.perfis[0].apresentacoesGenero.length <= 0
    )) {
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);
    }

    const senhaEncriptada: string = cryptToken(usuario.senha);

    const usuarioSaved = await this.repositoryUsuario.create({
      email: usuario.email,
      senha: senhaEncriptada,
      nome: usuario.nome,
      cpf: usuario.cpf,
      genero: usuario.genero,
      dataNascimento: usuario.dataNascimento,
      fotoUrl: usuario.fotoUrl
    });

    const perfilSaved = await this.repositoryPerfil.create({
      idUsuario: usuarioSaved.id,
      categoria: usuario.perfis[0].categoria,
      cidade: usuario.perfis[0].cidade,
      estado: usuario.perfis[0].estado,
      biografia: usuario.perfis[0].biografia,
      situacao: SituaçãoPerfil.ATIVO,
    });

    if (usuario.perfis[0].categoria === CategoriaPerfil.MUSICO) {
      const apresentacoesEspecialidadeSaved = await this.repositoryApresentacaoEspecialidade
        .create(usuario.perfis[0].apresentacoesEspecialidade.map((o) => {
          return {
            idMusico: perfilSaved.id,
            idEspecialidade: o.idEspecialidade,
            ano: o.ano,
            valorHora: o.valorHora,
          };
        }));
      const apresentacoesGeneroSaved = await this.repositoryApresentacaoGenero
        .create(usuario.perfis[0].apresentacoesGenero.map((o) => {
          return {
            idMusico: perfilSaved.id,
            idGeneroMusical: o.idGeneroMusical,
            ano: o.ano,
          };
        }));

      perfilSaved.apresentacoesEspecialidade = apresentacoesEspecialidadeSaved;
      perfilSaved.apresentacoesGenero = apresentacoesGeneroSaved;
    }

    usuarioSaved.perfis = [perfilSaved];

    return usuarioSaved;
  }

  async buscarUsuario(email: string, senha: string, tipoPerfil: number): Promise<EntidadeUsuario>{
    const usuario = await this.repositoryUsuario.selectByEmail(email);
    const senhaCriptografada = cryptToken(senha);

    if (!usuario || usuario.senha !== senhaCriptografada)
      throw new BusinessError(ErrorCodes.DADOS_LOGIN_INVALIDOS);

    if (usuario.perfis.filter(perfil => perfil.categoria === tipoPerfil).length === 0)
      throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO);

    return usuario;
  }

  async validaUsuarioExistente(email: string, cpf: string):
  Promise<{ valido: boolean, mensagem?: string }> {
    const existeEmail: EntidadeUsuario = await this.repositoryUsuario.selectByEmail(email);

    if (existeEmail) {
      return { valido: false, mensagem: 'E-mail em uso' };
    }

    const existeCpf: EntidadeUsuario = await this.repositoryUsuario.selectByCpf(cpf);

    if (existeCpf) {
      return { valido: false, mensagem: 'CPF em uso' };
    }

    return { valido: true, mensagem: null };
  }

  async alterarSenha(senha: string, idUsuario: string): Promise<void> {
    const usuarioSaved: EntidadeUsuario = await this.repositoryUsuario.selectById(idUsuario);

    if (!usuarioSaved) {
      throw new BusinessError(ErrorCodes.USUARIO_NAO_ENCONTRADO);
    }

    if (!senha) {
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);
    }

    const senhaCriptografada = cryptToken(senha);
    await this.repositoryUsuario.updateById(usuarioSaved.id, { senha: senhaCriptografada });
  }

  async buscarMeuUsuario(id: string): Promise<EntidadeUsuario> {
    const usuario = await this.repositoryUsuario.selectByIdWithProfiles(id);
    usuario.senha = undefined;
    
    return usuario;
  }

  async updateUsuario(idUsuario: string, usuario: EntidadeUsuario): Promise<void> {
    const usuarioSaved = await this.repositoryUsuario.selectById(idUsuario);

    if (!usuarioSaved) {
      throw new BusinessError(ErrorCodes.USUARIO_NAO_ENCONTRADO);
    }

    const usuarioToSave: EntidadeUsuario = {
      ...(usuario.nome && { nome: usuario.nome }),
      ...(usuario.genero && { genero: usuario.genero }),
      ...(usuario.dataNascimento && { dataNascimento: usuario.dataNascimento }),
      ...(usuario.fotoUrl && { fotoUrl: usuario.fotoUrl }),
      updatedBy: usuarioSaved.id,
    };

    await this.repositoryUsuario.updateById(usuarioSaved.id, usuarioToSave);
  }
}