import { IServicePerfil } from '@app/services/interfaces/perfil';
import TYPES from '@core/types';
import { inject } from 'inversify';
import { Request } from 'express';
import { BaseHttpController, controller, httpGet, interfaces } from 'inversify-express-utils';
import EntidadePerfil from '@core/entities/perfil';
import { IPerfilSearchParameter, Pagination} from '../../../core/src/models/pagination';


@controller('/perfil')
export class ControllerPerfil extends BaseHttpController implements interfaces.Controller {
  private servicePerfil: IServicePerfil;

  constructor(
  @inject(TYPES.ServicePerfil) servicePerfil: IServicePerfil,
  ) {
    super();
  
    this.servicePerfil = servicePerfil;
  }

  @httpGet('/musicos')
  private getMusicos(req: Request): Promise<Pagination<EntidadePerfil>> {

    const searchParameter: IPerfilSearchParameter = {
      generoMusical: req.query.generoMusical as string,
      especialidade: req.query.especialidade as string,
      cidade: req.query.cidade as string,
      estado: req.query.estado as string,
      valorMinimo: parseFloat(req.query.valorMinimo as string),
      valorMaximo: parseFloat(req.query.valorMaximo as string),
      pontuacaoAvaliacao: parseInt(req.query.pontuacaoAvaliacao as string),
    };

    return this.servicePerfil.getMusicosWithSearchParameters(searchParameter);
  }

}