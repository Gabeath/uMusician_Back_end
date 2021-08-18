import BusinessError, { ErrorCodes } from '@core/errors/business';
import { Pagination, SearchParameterBase } from '@core/models';
import { inject, injectable } from 'inversify';
import EntidadeConfirmacaoPresenca from '@core/entities/confirmacao-presenca';
import { IRepositoryConfirmacaoPresenca } from '@core/repositories/interfaces/confirmacao-presenca';
import { IServiceConfirmacaoPresenca } from '@app/services/interfaces/confirmacao-presenca';
import TYPES from '@core/types';

@injectable()
export class ServiceConfirmacaoPresenca implements IServiceConfirmacaoPresenca {
  private repositoryConfirmacaoPresenca: IRepositoryConfirmacaoPresenca;

  constructor(
  @inject(TYPES.RepositoryConfirmacaoPresenca) repositoryConfirmacaoPresenca: IRepositoryConfirmacaoPresenca,
  ) {
    this.repositoryConfirmacaoPresenca = repositoryConfirmacaoPresenca;
  }
  
  async gerarCodigoConfirmacao(idServico: string, idContratante: string): Promise<EntidadeConfirmacaoPresenca> {
    console.log(idServico, idContratante);
    return {} as EntidadeConfirmacaoPresenca;
  }
}