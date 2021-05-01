import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { IServiceMidia } from '@app/services/interfaces/midia';
import TYPES from '@core/types';
import { inject } from 'inversify';
import autenticado from '@app/middlewares/autenticado';
import reqFormData from '@app/middlewares/reqFormData';
import BusinessError, { ErrorCodes } from '@core/errors/business';
import { CategoriaPerfil, TipoMídia } from '@core/models';
import { uparArquivoNaNuvem, excluirArquivoTemporario } from '@app/utils/uploads';
import EntidadeMidia from '@core/entities/midia';
import isPerfilPermitido from '@app/middlewares/perfil';
import {compressImage} from '@app/utils/comprimirImagem'

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
    const { ano, titulo, tipo } = req.body as { ano: string, titulo: string, tipo: string };
    let pastaDestino = '';

    try {

      if (!req.file.filename || !ano || !titulo || !tipo)
        throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);

      if (Number(tipo) === TipoMídia.IMAGEM){
        pastaDestino = 'imagens';
        const newFileName = await compressImage(req.file);
        req.file.filename = newFileName;
      }
      else if (Number(tipo) === TipoMídia.VÍDEO)
        pastaDestino = 'videos';
      else if (Number(tipo) === TipoMídia.ÁUDIO)
        pastaDestino = 'audios';
      else
        throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);

      const { url } = await uparArquivoNaNuvem(req.file.filename, `portfolio/${pastaDestino}`);

      const midia = {
        ano,
        titulo,
        tipo,
        url,
        idPerfil: req.session.profileID,
      } as EntidadeMidia;

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