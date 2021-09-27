import BusinessError, { ErrorCodes } from  '@core/errors/business';
import { inject, injectable } from 'inversify';
import EntidadeAdmin from '@core/entities/administrador';
import { IRepositoryAdmin } from '@core/repositories/interfaces/administrador';
import { IServiceAdmin } from '@app/services/interfaces/administrador';
import TYPES from '@core/types';
import { cryptToken } from '@app/utils/tokens';

@injectable()
export class ServiceAdmin implements IServiceAdmin {
  private repositoryAdmin: IRepositoryAdmin;

  constructor(
  @inject(TYPES.RepositoryAdmin) repositoryAdmin: IRepositoryAdmin,
  ) {
    this.repositoryAdmin = repositoryAdmin;
  }

  async criarAdmin(admin: EntidadeAdmin): Promise<EntidadeAdmin> {
    const existe = await this.repositoryAdmin.selectByEmail(admin.email);

    if (existe) { throw new BusinessError(ErrorCodes.USUARIO_JA_CADASTRADO); }

    const senhaEncriptada: string = cryptToken(admin.senha);

    const adminSaved = await this.repositoryAdmin.create({
      email: admin.email,
      senha: senhaEncriptada,
      nome: admin.nome,
      cpf: admin.cpf,
    });

    adminSaved.senha = undefined;

    return adminSaved;
  }

  async buscarAdmin(email: string, senha: string): Promise<EntidadeAdmin> {
    const admin = await this.repositoryAdmin.selectByEmail(email);
    const senhaCriptografada = cryptToken(senha);

    if (!admin || admin.senha !== senhaCriptografada) { throw new BusinessError(ErrorCodes.DADOS_LOGIN_INVALIDOS); }
    return admin;
  }
}