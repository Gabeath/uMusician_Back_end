import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import BusinessError, { ErrorCodes } from '@core/errors/business';
import EntidadeEspecialidade from '@core/entities/especialidade';
import { IServiceEspecialidade } from '@app/services/interfaces/especialidade';
import { Pagination } from '@core/models';
import {Request} from 'express';
import TYPES from '@core/types';
import admin from '@app/middlewares/admin';
import autenticado from '@app/middlewares/autenticado';
import { compressImage } from '@app/utils/comprimirImagem';
import { controllerPaginationHelper } from '@app/utils/pagination';
import { inject } from 'inversify';
import reqFormData from '@app/middlewares/reqFormData';

@controller('/especialidade')
export class ControllerEspecialidade extends BaseHttpController implements interfaces.Controller {
  private serviceEspecialidade: IServiceEspecialidade;

  constructor(
  @inject(TYPES.ServiceEspecialidade) serviceEspecialidade: IServiceEspecialidade,
  ) {
    super();

    this.serviceEspecialidade = serviceEspecialidade;
  }

  @httpGet('/seletor')
  private getAllEspecialidades(): Promise<EntidadeEspecialidade[]> {
    return this.serviceEspecialidade.getSelectable();
  }

  @httpGet('/')
  private getAll(req: Request): Promise<Pagination<EntidadeEspecialidade>> {
    return this.serviceEspecialidade.getAll({
      ...controllerPaginationHelper(req.query),
    });
  }

  @httpPost('/', autenticado, admin, reqFormData.single('imagem'))
  private async addEspecialidade(req: Request) : Promise<EntidadeEspecialidade>{
    const {nome, popularidade, classificacao, idSolicitacao} = req.body as 
    {nome: string, popularidade: number, classificacao: number, idSolicitacao: string};

    if(!req.file || !nome || !popularidade || !classificacao)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);

    const newFileName = await compressImage(req.file);

    return this.serviceEspecialidade.addEspecialidade(nome, popularidade, classificacao, idSolicitacao, newFileName);
  }
}