import { Repository, getConnection, getRepository, Between } from 'typeorm';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import EntidadePerfil from '@core/entities/perfil';
import { IRepositoryPerfil } from './interfaces/perfil';

import { injectable } from 'inversify';
import { IPerfilSearchParameter, Pagination } from '@core/models/pagination';
import { serialize } from 'node:v8';
import { CategoriaPerfil } from '@core/models/enumerators';

@injectable()
export class RepositoryPerfil implements IRepositoryPerfil {
  private repositoryPerfil: Repository<EntidadePerfil> = getRepository(EntidadePerfil);

  async getMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter):
  Promise<Pagination<EntidadePerfil>> {
    const queryBuilder = getConnection().createQueryBuilder(EntidadePerfil, 'perfil');
    const [rows, count] = await this.repositoryPerfil.findAndCount({
      join: {alias : 'perfis', leftJoinAndSelect: { 
        generosMusicais: 'perfis.generosMusicais',
        apresentacoes: 'perfis.apresentacoes',
        avaliacoes: 'perfis.avaliacoes',
        usuario: 'perfis.usuario',
      }},
      where: qb => { 
        qb.where({
          cidade: searchParameter.cidade,
          estado: searchParameter.estado,
          categoria: CategoriaPerfil.MUSICO,
        })
        .andWhere('generosMusicais.idGeneroMusical = :idGeneroMusical', {idGeneroMusical: searchParameter.generoMusical})
        .andWhere('apresentacoes.idEspecialidade = :idApresentacao', {idApresentacao: searchParameter.especialidade})
        .andWhere('apresentacoes.valorHora BETWEEN :valorMinimo AND :valorMaximo', {valorMinimo: searchParameter.valorMinimo, valorMaximo: searchParameter.valorMaximo})
        .andWhere('avaliacoes.pontuacao = :pontuacao', {pontuacao: searchParameter.pontuacaoAvaliacao});

      }
    });

    // const [rows , count] = await getConnection()
    // .createQueryBuilder()
    // .select()
    // .from(EntidadePerfil, 'perfil')
    // .where('perfil.cidade = :cidade', {cidade: searchParameter.cidade})
    // .andWhere('perfil.estado = :estado', {estado: searchParameter.estado})
    // .leftJoinAndSelect('perfil.generosMusicais', 'generoMusical')
    // .where('generoMusical.id = :id', {id: searchParameter.generoMusical});

    return {rows , count};
    
  }
}
