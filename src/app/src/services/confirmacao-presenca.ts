import BusinessError, { ErrorCodes } from '@core/errors/business';
import { SituaçãoServiço, StatusConfirmacaoPresenca } from '@core/models';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import EntidadeConfirmacaoPresenca from '@core/entities/confirmacao-presenca';
import { IRepositoryConfirmacaoPresenca } from '@core/repositories/interfaces/confirmacao-presenca';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceConfirmacaoPresenca } from '@app/services/interfaces/confirmacao-presenca';
import TYPES from '@core/types';
import crypto from 'crypto';

@injectable()
export class ServiceConfirmacaoPresenca implements IServiceConfirmacaoPresenca {
  private repositoryConfirmacaoPresenca: IRepositoryConfirmacaoPresenca;
  private repositoryServico: IRepositoryServico;

  constructor(
  @inject(TYPES.RepositoryConfirmacaoPresenca) repositoryConfirmacaoPresenca: IRepositoryConfirmacaoPresenca,
    @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
  ) {
    this.repositoryConfirmacaoPresenca = repositoryConfirmacaoPresenca;
    this.repositoryServico = repositoryServico;
  }
  
  async gerarCodigoConfirmacao(idServico: string, idMusico: string): Promise<EntidadeConfirmacaoPresenca> {
    const servico = await this.repositoryServico.selectByIdWithEvento(idServico);
    
    if (!servico) { throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS); }

    let confirmacao = await this.repositoryConfirmacaoPresenca.selectByIdServico(servico.id);

    if (!confirmacao) {
      const codigo = crypto.randomBytes(6).toString('hex').substring(0, 12).toUpperCase();
  
      confirmacao = await this.repositoryConfirmacaoPresenca.create({
        codigo,
        idContratante: servico.evento.idContratante,
        idServico: servico.id,
        idMusico: idMusico,
        status: StatusConfirmacaoPresenca.CRIADA,
        createdBy: idMusico,
      });
    }

    return confirmacao;
  }

  async confirmarPresenca(idServico: string, codigo: string, idContratante: string): Promise<void> {
    const servico = await this.repositoryServico.selectByIdWithEvento(idServico);
    
    if (!servico) { throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS); }

    const confirmacao = await this.repositoryConfirmacaoPresenca.selectByIdServico(servico.id);
    
    if (!confirmacao) { throw new BusinessError(ErrorCodes.SERVICO_SEM_CONFIRMACAO_CRIADA); }
    if (confirmacao.codigo !== codigo) { throw new BusinessError(ErrorCodes.CODIGO_INVALIDO); }
    if (DateTime.fromJSDate(servico.evento.dataInicio as Date).diffNow('day').days >= 0) {
      throw new BusinessError(ErrorCodes.EVENTO_NAO_INICIADO);
    }

    await this.repositoryConfirmacaoPresenca.updateById(confirmacao.id, {
      status: StatusConfirmacaoPresenca.CONFIRMADA,
      updatedBy: idContratante,
    });

    await this.repositoryServico.updateById(servico.id, {
      situacao: SituaçãoServiço.CONCLUÍDO,
      updatedBy: idContratante,
    });
  }
}