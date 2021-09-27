import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import BusinessError, { ErrorCodes } from '@core/errors/business';
import { Request, Response } from 'express';
import { destroyCache, getCache, setCache } from '@app/utils/operacoesRedis';
import { IServiceAdmin } from '@app/services/interfaces/administrador';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import TYPES from '@core/types';
import crypto from 'crypto';
import { generateJWT } from '../utils/tokens';
import { inject } from 'inversify';
import { sendResetPasswordMail } from '@app/utils/envioDeEmail';

@controller('/login')
export class LoginController extends BaseHttpController implements interfaces.Controller {
  private serviceAdmin: IServiceAdmin;
  private serviceUsuario: IServiceUsuario;

  constructor(
  @inject(TYPES.ServiceAdmin) serviceAdmin: IServiceAdmin,
    @inject(TYPES.ServiceUsuario) serviceUsuario: IServiceUsuario,
  ) {
    super();

    this.serviceAdmin = serviceAdmin;
    this.serviceUsuario = serviceUsuario;
  }

  @httpPost('/')
  private async login(req: Request, res: Response): Promise<Response>{
    const {
      email,
      senha,
      tipoPerfil,
    } = req.body as {
      email: string,
      senha: string,
      tipoPerfil: number,
    };

    if(!email || !senha || !tipoPerfil) { throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES); }
    
    try {
      const usuario = await this.serviceUsuario.buscarUsuario(email, senha, tipoPerfil);
      const perfil = usuario.perfis.filter(perfil => perfil.categoria === tipoPerfil)[0];
      const token = generateJWT({
        userID: usuario.id,
        profileType: tipoPerfil,
        profileID: perfil.id
      });

      res.setHeader('authorization', 'Bearer '+ token);

      usuario.senha = undefined;

      return res.json(usuario);
    } catch (err) {
      return res.status(400).json({
        'message': err.message as string,
      });
    }
  }

  @httpPost('/admin')
  private async loginAdmin(req: Request, res: Response): Promise<Response>{
    const {
      email,
      senha,
    } = req.body as {
      email: string,
      senha: string,
    };

    if(!email || !senha) { throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES); }
    
    try {
      const admin = await this.serviceAdmin.buscarAdmin(email, senha);
      const token = generateJWT({ userID: admin.id });

      res.setHeader('authorization', 'Bearer '+ token);

      return res.json(admin);
    } catch (err) {
      return res.status(400).json({
        'message': err.message as string,
      });
    }
  }

  @httpPost('/sendEmailForgotPassword')
  private async sendEmailForgotPassword(req: Request, res: Response): Promise<Response>{
    const {email} = req.body as {email: string};

    if(!email)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);

    const usuario = await this.serviceUsuario.buscarUsuarioPeloEmail(email);

    if(usuario){
      
      const codigo = crypto.randomBytes(4).toString('hex').substring(0, 6).toUpperCase();
      await setCache(codigo, email, 86400);

      try {
        await sendResetPasswordMail(usuario.nome, email, codigo);
      } catch (error){
        console.log(error);
        await destroyCache(codigo);
        return res.status(400).json({
          'message': 'Não foi possível enviar o email para redefinição de senha. Entre em contato'
        });
      }
    }
  }

  @httpPost('/validadeCode')
  private async validateCode(req: Request, res: Response): Promise<Response>{
    const {email, codigo} = req.body as {email: string, codigo: string};

    if(!email || !codigo)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);

    const emailSalvo = await getCache(codigo);

    if(!emailSalvo || emailSalvo !== email)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);

    const usuario = await this.serviceUsuario.buscarUsuarioPeloEmail(email);

    if(!usuario)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);

    return res.json({
      name: usuario.nome
    });
  }

  @httpPost('/resetPassword')
  private async resetPassword(req: Request): Promise<void>{
    const {email, codigo, senha} = req.body as {email: string, codigo: string, senha: string};

    if(!email || !codigo || !senha)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);

    const emailSalvo = await getCache(codigo);

    if(!emailSalvo || emailSalvo !== email)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);

    const usuario = await this.serviceUsuario.buscarUsuarioPeloEmail(email);

    if(!usuario)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);

    await this.serviceUsuario.alterarSenha(senha, usuario.id);
    await destroyCache(codigo);
  }
}