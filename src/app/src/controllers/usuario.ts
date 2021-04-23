import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { dadosArquivo, uparArquivoNaNuvem } from '@app/utils/uploads';
import EntidadeApresentacao from '@core/entities/apresentacao';
import EntidadeGeneroMusicalPerfil from '@core/entities/genero-musical-perfil';
import EntidadeUsuario from '@core/entities/usuario';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import TYPES from '@core/types';
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

  @httpPost('/valida-email-cpf')
  private validaEmailCpf(req: Request): Promise<{ valido: boolean, mensagem?: string }> {
    const { email, cpf } = req.body as { email: string, cpf: string };
    return this.serviceUsuario.validaUsuarioExistente(email, cpf);
  }

  @httpPost('/')
  private criarUsuarioPerfil(req: Request): Promise<EntidadeUsuario> {
    const usuario: EntidadeUsuario = {
      email: req.body.usuario.email as string,
      senha: req.body.usuario.senha as string,
      nome: req.body.usuario.nome as string,
      cpf: req.body.usuario.cpf as string,
      genero: req.body.usuario.genero as number,
      dataNascimento: req.body.usuario.dataNascimento as string,
      perfis: [{
        categoria: req.body.usuario.perfil.categoria as number,
        cidade: req.body.usuario.perfil.cidade as string,
        estado: req.body.usuario.perfil.estado as string,
        biografia: req.body.usuario.perfil.biografia as string,
        generosMusicais: req.body.usuario.perfil.generosMusicais as EntidadeGeneroMusicalPerfil[],
        apresentacoes: req.body.usuario.perfil.apresentacoes as EntidadeApresentacao[],
      }]
    };

    return this.serviceUsuario.criarUsuarioPerfil(usuario);
  }

  @httpPost('/fotoPerfil', reqFormData.single('imagem'))
  private async uploadFotoPerfil(req: Request, res: Response): Promise<dadosArquivo | Response>{
    try {
      return await uparArquivoNaNuvem(req.file.filename, 'perfil');
    } catch (error) {
      return res.status(500).json({
        'message': error.message
      });
    }
    
  }
}