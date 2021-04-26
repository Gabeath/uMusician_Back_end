import {
  BaseHttpController,
  controller,
  httpGet,
  interfaces,
} from 'inversify-express-utils';
import EntidadeGeneroMusical from '@core/entities/genero-musical';
import { IServiceGeneroMusical } from '@app/services/interfaces/generoMusical';
import { Request } from 'express';
import TYPES from '@core/types';
import { inject } from 'inversify';

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
  private getAllGenerosMusicais(req: Request): Promise<EntidadeGeneroMusical[]> {
    return this.serviceGeneroMusical.getAll();
  }
}