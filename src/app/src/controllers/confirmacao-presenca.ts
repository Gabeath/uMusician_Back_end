import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { CategoriaPerfil } from '@core/models';
import EntidadeConfirmacaoPresenca from '@core/entities/confirmacao-presenca';
import { IServiceConfirmacaoPresenca } from '@app/services/interfaces/confirmacao-presenca';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { inject } from 'inversify';
import isPerfilPermitido from '@app/middlewares/perfil';

@controller('/confirmacao-presenca')
export class ControllerConfirmacaoPresenca extends BaseHttpController implements interfaces.Controller {
  private serviceConfirmacaoPresenca: IServiceConfirmacaoPresenca;

  constructor(
  @inject(TYPES.ServiceConfirmacaoPresenca) serviceConfirmacaoPresenca: IServiceConfirmacaoPresenca,
  ) {
    super();

    this.serviceConfirmacaoPresenca = serviceConfirmacaoPresenca;
  }

  @httpPost('/gerar-confirmacao', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async gerarCodigoConfirmacao(req: Request): Promise<EntidadeConfirmacaoPresenca> {
    const idServico = req.body.idServico as string;
    return this.serviceConfirmacaoPresenca.gerarCodigoConfirmacao(idServico, req.session.profileID);
  }

  @httpPost('/confirmar', autenticado, isPerfilPermitido(CategoriaPerfil.CONTRATANTE))
  private async confirmarPresenca(req: Request): Promise<void> {
    const idServico = req.body.idServico as string;
    const codigo = req.body.codigo as string;
    await this.serviceConfirmacaoPresenca.confirmarPresenca(idServico, codigo, req.session.profileID);
  }
}