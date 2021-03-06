import BusinessError, { ErrorCodes } from '@core/errors/business';
import { Pagination, SearchParameterBase, SituaçãoSolicitacao, TipoSolicitacao } from '@core/models';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import EntidadeGeneroMusical from '@core/entities/genero-musical';
import { IRepositoryGeneroMusical } from '@core/repositories/interfaces/genero-musical';
import { IRepositorySolicitacao } from '@core/repositories/interfaces/solicitacao';
import { IServiceGeneroMusical } from './interfaces/generoMusical';
import TYPES from '@core/types';
import { uparArquivoNaNuvem } from '@app/utils/uploads';

@injectable()
export class ServiceGeneroMusical implements IServiceGeneroMusical {
  private repositoryGeneroMusical: IRepositoryGeneroMusical;
  private repositorySolicitacao: IRepositorySolicitacao;

  constructor(
  @inject(TYPES.RepositoryGeneroMusical) repositoryGeneroMusical: IRepositoryGeneroMusical,
    @inject(TYPES.RepositorySolicitacao) repositorySolicitacao: IRepositorySolicitacao,
  ) {
    this.repositoryGeneroMusical = repositoryGeneroMusical;
    this.repositorySolicitacao = repositorySolicitacao;
  }

  async getSelectable(): Promise<EntidadeGeneroMusical[]> {
    return this.repositoryGeneroMusical.selectAll();
  }

  async getAll(searchParameter: SearchParameterBase): Promise<Pagination<EntidadeGeneroMusical>> {
    return this.repositoryGeneroMusical.selectAllWithPagination({
      ...searchParameter,
      limit: undefined,
      orderBy: 'nome',
      isDESC: false,
    });
  }

  async addGeneroMusical(nome: string, popularidade: number, idSolicitacao: string, filename: string):
  Promise<EntidadeGeneroMusical> {

    if(idSolicitacao){
      const solicitacao = await this.repositorySolicitacao.selectById(idSolicitacao);

      if(!solicitacao)
        throw new BusinessError(ErrorCodes.SOLICITACAO_NAO_ENCONTRADA);

      if(solicitacao.situacao !== SituaçãoSolicitacao.PENDENTE)
        throw new BusinessError(ErrorCodes.SOLICITACAO_NAO_PENDENTE);

      if(solicitacao.tipo !== TipoSolicitacao.GENERO_MUSICAL)
        throw new BusinessError(ErrorCodes.SOLICITACAO_GENERO_INVALIDA);

      solicitacao.dataInclusao = DateTime.local().toFormat('yyyy-LL-dd');
      solicitacao.situacao = SituaçãoSolicitacao.ACEITA;
      
      await this.repositorySolicitacao.save(solicitacao);
    }

    const existsByName = await this.repositoryGeneroMusical.existsByName(nome);

    if(existsByName)
      throw new BusinessError(ErrorCodes.GENERO_MUSICAL_JA_CADASTRADO);

    const {url} = await uparArquivoNaNuvem(filename, 'generos-musicais');

    const genero = {
      nome,
      popularidade,
      iconeUrl: url
    } as EntidadeGeneroMusical;

    return this.repositoryGeneroMusical.addGeneroMusical(genero);
  }
}