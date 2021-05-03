import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { dadosArquivo, uparArquivoNaNuvem } from '@app/utils/uploads';
import EntidadeApresentacao from '@core/entities/apresentacao';
import EntidadeGeneroMusicalPerfil from '@core/entities/genero-musical-perfil';
import EntidadeUsuario from '@core/entities/usuario';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { compressImage } from '@app/utils/comprimirImagem';
import { generateJWT } from '@app/utils/tokens';
import { inject } from 'inversify';
import reqFormData from '@app/middlewares/reqFormData';

@controller('/usuario')
export class ControllerUsuario extends BaseHttpController implements interfaces.Controller {
  private serviceUsuario: IServiceUsuario;

  constructor(
  @inject(TYPES.ServiceUsuario) serviceUsuario: IServiceUsuario,
  ) {
    super();

    this.serviceUsuario = serviceUsuario;
  }

  @httpPost('/fotoPerfil', reqFormData.single('imagem'))
  private async uploadFotoPerfil(req: Request): Promise<dadosArquivo | Response> {
    const newFileName = await compressImage(req.file);
    return uparArquivoNaNuvem(newFileName, 'perfil');
  }

  @httpPost('/atualizarSenha', autenticado)
  private async atualizarSenha(req: Request): Promise<void> {
    const { senha } = req.body as { senha: string };
    await this.serviceUsuario.alterarSenha(senha, req.session.userID);
  }

  @httpPost('/valida-email-cpf')
  private validaEmailCpf(req: Request): Promise<{ valido: boolean, mensagem?: string }> {
    const { email, cpf } = req.body as { email: string, cpf: string };
    return this.serviceUsuario.validaUsuarioExistente(email, cpf);
  }

  @httpPost('/')
  private async criarUsuarioPerfil(req: Request, res: Response): Promise<EntidadeUsuario> {
    const usuario: EntidadeUsuario = {
      email: req.body.usuario.email as string,
      senha: req.body.usuario.senha as string,
      nome: req.body.usuario.nome as string,
      cpf: req.body.usuario.cpf as string,
      genero: req.body.usuario.genero as number,
      dataNascimento: req.body.usuario.dataNascimento as string,
      fotoUrl: req.body.usuario.fotoUrl as string,
      perfis: [{
        categoria: req.body.usuario.perfil.categoria as number,
        cidade: req.body.usuario.perfil.cidade as string,
        estado: req.body.usuario.perfil.estado as string,
        biografia: req.body.usuario.perfil.biografia as string,
        generosMusicais: req.body.usuario.perfil.generosMusicais as EntidadeGeneroMusicalPerfil[],
        apresentacoes: req.body.usuario.perfil.apresentacoes as EntidadeApresentacao[],
      }]
    };

    const user = await this.serviceUsuario.criarUsuarioPerfil(usuario);

    const token = generateJWT({
      userID: user.id,
      profileID: user.perfis[0].id,
      profileType: usuario.perfis[0].categoria,
    });

    res.setHeader('authorization', 'Bearer ' + token);
    user.senha = undefined;

    return user;
  }

  @httpGet('/me', autenticado)
  private async buscarMeuUsuario(req: Request): Promise<EntidadeUsuario> {
    return this.serviceUsuario.buscarMeuUsuario(req.session.userID);
  }

  @httpPut('/', autenticado)
  private async updateUsuario(req: Request): Promise<void> {
    const usuario = req.body.usuario as EntidadeUsuario;

    await this.serviceUsuario.updateUsuario(req.session.userID, usuario);
  }
}