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
import {Request} from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { compressImage } from '@app/utils/comprimirImagem';
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
    return this.serviceEspecialidade.getAll();
  }

  @httpPost('/', autenticado, reqFormData.single('imagem'))
  private async addEspecialidade(req: Request) : Promise<EntidadeEspecialidade>{
    const {nome, popularidade, classificacao, idSolicitacao} = req.body as 
    {nome: string, popularidade: number, classificacao: number, idSolicitacao: string};

    if(!req.file || !nome || !popularidade || !classificacao)
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);

    const newFileName = await compressImage(req.file);

    return this.serviceEspecialidade.addEspecialidade(nome, popularidade, classificacao, idSolicitacao, newFileName);
  }
}