import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import BusinessError, { ErrorCodes } from '@core/errors/business';
import EntidadeGeneroMusical from '@core/entities/genero-musical';
import { IServiceGeneroMusical } from '@app/services/interfaces/generoMusical';
import { Pagination } from '@core/models';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { compressImage } from '@app/utils/comprimirImagem';
import { controllerPaginationHelper } from '@app/utils/pagination';
import { inject } from 'inversify';
import reqFormData from '@app/middlewares/reqFormData';

@controller('/generoMusical')
export class ControllerGeneroMusical extends BaseHttpController implements interfaces.Controller {
  private serviceGeneroMusical: IServiceGeneroMusical;

  constructor(
  @inject(TYPES.ServiceGeneroMusical) serviceGeneroMusical: IServiceGeneroMusical,
  ) {
    super();

    this.serviceGeneroMusical = serviceGeneroMusical;
  }

  @httpGet('/seletor')
  private getSelectable(): Promise<EntidadeGeneroMusical[]> {
    return this.serviceGeneroMusical.getSelectable();
  }

  @httpGet('/')
  private getAll(req: Request): Promise<Pagination<EntidadeGeneroMusical>> {
    return this.serviceGeneroMusical.getAll({
      ...controllerPaginationHelper(req.query),
    });
  }

  @httpPost('/', autenticado, reqFormData.single('imagem'))
  private async addGeneroMusical(req: Request) : Promise<EntidadeGeneroMusical>{
    const {nome, popularidade, idSolicitacao} = req.body as {nome: string, popularidade: number, idSolicitacao: string};

    if(!req.file || !nome || !popularidade)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);

    const newFileName = await compressImage(req.file);

    return this.serviceGeneroMusical.addGeneroMusical(nome, popularidade, idSolicitacao, newFileName);
  }
}