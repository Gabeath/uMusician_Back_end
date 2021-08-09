import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import BusinessError, { ErrorCodes } from '@core/errors/business';
import { CategoriaPerfil, TipoMídia } from '@core/models';
import { Request, Response } from 'express';
import { excluirArquivoTemporario, uparArquivoNaNuvem } from '@app/utils/uploads';
import EntidadeMidia from '@core/entities/midia';
import { IServiceMidia } from '@app/services/interfaces/midia';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { compressImage } from '@app/utils/comprimirImagem';
import { inject } from 'inversify';
import isPerfilPermitido from '@app/middlewares/perfil';
import reqFormData from '@app/middlewares/reqFormData';

@controller('/midia', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
export class MidiaController extends BaseHttpController implements interfaces.Controller {
  private serviceMidia: IServiceMidia;
  constructor(@inject(TYPES.ServiceMidia) serviceMidia: IServiceMidia,) {
    super();
    this.serviceMidia = serviceMidia;
  }

  @httpPost('/', reqFormData.single('midia'))
  private async criarMidiaPortfólio(req: Request, res: Response):
  Promise<Response | EntidadeMidia> {
    const ano = req.body.ano as string;
    const titulo = req.body.titulo as string;
    const tipo = parseInt(req.body.tipo as string, 10);
    let pastaDestino = '';

    try {

      if (!req.file.filename || !ano || !titulo || !tipo) { throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES); }

      if (tipo === TipoMídia.IMAGEM) {
        pastaDestino = 'imagens';
        const newFileName = await compressImage(req.file);
        req.file.filename = newFileName;
      }
      else if (tipo === TipoMídia.VÍDEO)
        pastaDestino = 'videos';
      else if (tipo === TipoMídia.ÁUDIO)
        pastaDestino = 'audios';
      else
        throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);

      const { url } = await uparArquivoNaNuvem(req.file.filename, `portfolio/${pastaDestino}`);

      const midia: EntidadeMidia = {
        ano,
        titulo,
        tipo,
        url,
        idMusico: req.session.profileID,
      };

      return await this.serviceMidia.createMidia(midia);
    } catch (error) {
      excluirArquivoTemporario(req.file.filename);
    
      if (error instanceof BusinessError)
        throw error;
      else
        return res.status(500).json({ 'message': error.message as string });
    }
  }
}