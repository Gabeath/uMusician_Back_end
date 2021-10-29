import BusinessError, { ErrorCodes } from '@core/errors/business';
import { Pagination, SearchParameterBase, SituaçãoSolicitacao, TipoSolicitacao } from '@core/models';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import EntidadeEspecialidade from '@core/entities/especialidade';
import { IRepositoryEspecialidade } from '@core/repositories/interfaces/especialidade';
import { IRepositorySolicitacao } from '@core/repositories/interfaces/solicitacao';
import { IServiceEspecialidade } from './interfaces/especialidade';
import TYPES from '@core/types';
import { uparArquivoNaNuvem } from '@app/utils/uploads';


@injectable()
export class ServiceEspecialidade implements IServiceEspecialidade {
  private repositoryEspecialidade: IRepositoryEspecialidade;
  private repositorySolicitacao: IRepositorySolicitacao;

  constructor(
  @inject(TYPES.RepositoryEspecialidade) repositoryEspecialidade: IRepositoryEspecialidade,
    @inject(TYPES.RepositorySolicitacao) repositorySolicitacao: IRepositorySolicitacao,
  ) {
    this.repositoryEspecialidade = repositoryEspecialidade;
    this.repositorySolicitacao = repositorySolicitacao;
  }

  async getSelectable(): Promise<EntidadeEspecialidade[]> {
    return this.repositoryEspecialidade.selectAll();
  }

  async getAll(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeEspecialidade>> {
    return this.repositoryEspecialidade.selectAllWithPagination({
      ...searchParameter,
      limit: undefined,
    });
  }

  async addEspecialidade(nome: string, popularidade: number, classificacao: number,
    idSolicitacao: string, filename: string):Promise<EntidadeEspecialidade> {

    if(idSolicitacao){
      const solicitacao = await this.repositorySolicitacao.selectById(idSolicitacao);

      if(!solicitacao)
        throw new BusinessError(ErrorCodes.SOLICITACAO_NAO_ENCONTRADA);

      if(solicitacao.situacao !== SituaçãoSolicitacao.PENDENTE)
        throw new BusinessError(ErrorCodes.SOLICITACAO_NAO_PENDENTE);

      if(solicitacao.tipo !== TipoSolicitacao.ESPECIALIDADE)
        throw new BusinessError(ErrorCodes.SOLICITACAO_ESPECIALIDADE_INVALIDA);

      solicitacao.dataInclusao = DateTime.local().toFormat('yyyy-LL-dd');
      solicitacao.situacao = SituaçãoSolicitacao.ACEITA;
      
      await this.repositorySolicitacao.save(solicitacao);
    }

    const {url} = await uparArquivoNaNuvem(filename, 'especialidades');

    const especialidade = {
      nome,
      popularidade,
      classificacao,
      iconeUrl: url
    } as EntidadeEspecialidade;

    return this.repositoryEspecialidade.addEspecialidade(especialidade);
  }

}