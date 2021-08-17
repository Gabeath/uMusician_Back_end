import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  interfaces,
} from 'inversify-express-utils';
import { CategoriaPerfil, SituaçãoServiço } from '@core/models';
import EntidadeServico from '@core/entities/servico';
import { IServiceServico } from '@app/services/interfaces/servico';
import { Request } from 'express';
import TYPES from '@core/types';
import autenticado from '@app/middlewares/autenticado';
import { inject } from 'inversify';
import isPerfilPermitido from '@app/middlewares/perfil';

@controller('/servico')
export class ControllerServico extends BaseHttpController implements interfaces.Controller {
  private serviceServico: IServiceServico;

  constructor(
  @inject(TYPES.ServiceServico) serviceServico: IServiceServico,
  ) {
    super();

    this.serviceServico = serviceServico;
  }

  @httpGet('/musico/pendentes', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async getServicosPendentesMusico(req: Request): Promise<EntidadeServico[]> {
    return this.serviceServico.getServicosPendentesMusico(req.session.profileID);
  }

  @httpGet('/:id', autenticado)
  private async getDetalhesServico(req: Request): Promise<EntidadeServico | null> {
    return this.serviceServico.getDetalhesServico(req.params.id);
  }

  @httpPost('/:id/resposta', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async responderSolicitacaoServico(req: Request): Promise<void> {
    return this.serviceServico.responderSolicitacaoServico(
      req.params.id,
      req.body.resposta as SituaçãoServiço,
      req.session.profileID,
    );
  }

  @httpDelete('/:id/musico/cancelar', autenticado, isPerfilPermitido(CategoriaPerfil.MUSICO))
  private async musicoCancelarServico(req: Request): Promise<void> {
    return this.serviceServico.musicoCancelarServico(
      req.params.id,
      req.session.profileID,
    );
  }

  @httpDelete('/:id/contratante/cancelar', autenticado, isPerfilPermitido(CategoriaPerfil.CONTRATANTE))
  private async contratanteCancelarServico(req: Request): Promise<void> {
    return this.serviceServico.contratanteCancelarServico(
      req.params.id,
      req.session.profileID,
    );
  }
}