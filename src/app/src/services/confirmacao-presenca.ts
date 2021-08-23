import BusinessError, { ErrorCodes } from '@core/errors/business';
import { SituaçãoServiço, StatusConfirmacaoPresenca } from '@core/models';
import { inject, injectable } from 'inversify';
import EntidadeConfirmacaoPresenca from '@core/entities/confirmacao-presenca';
import { IRepositoryConfirmacaoPresenca } from '@core/repositories/interfaces/confirmacao-presenca';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceConfirmacaoPresenca } from '@app/services/interfaces/confirmacao-presenca';
import TYPES from '@core/types';

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
  
  async gerarCodigoConfirmacao(idServico: string, idContratante: string): Promise<EntidadeConfirmacaoPresenca> {
    const servico = await this.repositoryServico.selectCompleteById(idServico);
    
    if (!servico) { throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS); }

    const codigo = Math.random().toString(36).substring(2, 12);

    const confirmacao = await this.repositoryConfirmacaoPresenca.create({
      codigo,
      idContratante,
      idServico: servico.id,
      idMusico: servico.especialidadesServico[0].apresentacaoEspecialidade.idMusico,
      status: StatusConfirmacaoPresenca.CRIADA,
      createdBy: idContratante,
    });

    await this.repositoryServico.updateById(servico.id, {
      situacao: SituaçãoServiço.PENDENTE_CONFIRMACAO_PRESENCA,
      updatedBy: idContratante,
    });

    return confirmacao;
  }

  async confirmarPresenca(idServico: string, codigo: string, idMusico: string): Promise<void> {
    const servico = await this.repositoryServico.selectById(idServico);
    
    if (!servico) { throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS); }

    const confirmacao = await this.repositoryConfirmacaoPresenca.selectByIdServico(servico.id);
    
    if (!confirmacao) { throw new BusinessError(ErrorCodes.SERVICO_SEM_CONFIRMACAO_CRIADA); }
    if (confirmacao.codigo === codigo) { throw new BusinessError(ErrorCodes.CODIGO_INVALIDO); }

    await this.repositoryConfirmacaoPresenca.updateById(confirmacao.id, {
      status: StatusConfirmacaoPresenca.CONFIRMADA,
      updatedBy: idMusico,
    });

    await this.repositoryServico.updateById(servico.id, {
      situacao: SituaçãoServiço.CONCLUÍDO,
      updatedBy: idMusico,
    });
  }
}