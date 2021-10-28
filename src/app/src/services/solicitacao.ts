import BusinessError, { ErrorCodes } from  '@core/errors/business';
import { Pagination, SearchParameterBase, SituaçãoSolicitacao, TipoSolicitacao } from '@core/models';
import { inject, injectable } from 'inversify';
import EntidadeSolicitacao from '@core/entities/solicitacao';
import { IRepositorySolicitacao } from '@core/repositories/interfaces/solicitacao';
import { IServiceSolicitacao } from '@app/services/interfaces/solicitacao';
import TYPES from '@core/types';

@injectable()
export class ServiceSolicitacao implements IServiceSolicitacao {
  private repositorySolicitacao: IRepositorySolicitacao;

  constructor(
  @inject(TYPES.RepositorySolicitacao) repositorySolicitacao: IRepositorySolicitacao,
  ) {
    this.repositorySolicitacao = repositorySolicitacao;
  }

  async criarSolicitacao(solicitacao: EntidadeSolicitacao, idSolicitante: string): Promise<EntidadeSolicitacao> {
    if (solicitacao.tipo !== TipoSolicitacao.ESPECIALIDADE && solicitacao.tipo !== TipoSolicitacao.GENERO_MUSICAL) {
      throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);
    }

    return this.repositorySolicitacao.save({
      nome: solicitacao.nome,
      tipo: solicitacao.tipo,
      situacao: SituaçãoSolicitacao.PENDENTE,
      idSolicitante
    });
  }

  async getSolicitacoesPendentes(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeSolicitacao>> {
    return this.repositorySolicitacao.selectBySearchParameter({
      ...searchParameter,
      limit: undefined,
      situacoesDasSolicitacoes: [ SituaçãoSolicitacao.PENDENTE ],
      orderBy: 'createdAt',
      isDESC: false,
    });
  }

  async getSolicitacoesConcluidas(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeSolicitacao>> {
    return this.repositorySolicitacao.selectBySearchParameter({
      ...searchParameter,
      limit: undefined,
      situacoesDasSolicitacoes: [ SituaçãoSolicitacao.ACEITA, SituaçãoSolicitacao.REJEITADA ],
      orderBy: 'createdAt',
      isDESC: false,
    });
  }

  async rejeitarSolicitacao(idSolicitacao: string, idAdmin: string): Promise<void> {
    const solicitacao = await this.repositorySolicitacao.selectById(idSolicitacao);

    if (!solicitacao) { throw new BusinessError(ErrorCodes.SOLICITACAO_NAO_ENCONTRADA); }

    await this.repositorySolicitacao.updateById(solicitacao.id, {
      situacao: SituaçãoSolicitacao.REJEITADA,
      updatedBy: idAdmin,
    });
  }
}