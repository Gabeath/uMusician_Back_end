import {
  CategoriaPerfil,
  IMusicoSearchParameter,
  Pagination,
  SituaçãoPerfil,
} from '@core/models';
import {
  ILike,
  In,
  Repository,
  getRepository,
} from 'typeorm';
import { DateTime } from 'luxon';
import EntidadePerfil from '@core/entities/perfil';
import { IRepositoryPerfil } from './interfaces/perfil';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { injectable } from 'inversify';

@injectable()
export class RepositoryPerfil implements IRepositoryPerfil {
  private repositoryPerfil: Repository<EntidadePerfil> = getRepository(EntidadePerfil);

  async selectMusicosWithSearchParameters(searchParameter: IMusicoSearchParameter):
  Promise<Pagination<EntidadePerfil>> {
    const [ rows, count ] = await this.repositoryPerfil.findAndCount({
      where: {
        ...(searchParameter.listaIdMusico && { id: In(searchParameter.listaIdMusico) }),
        ...(searchParameter.listaIdUsuario && { idUsuario: In(searchParameter.listaIdUsuario) }),
        ...(searchParameter.cidade && { cidade: ILike(`%${searchParameter.cidade}%`) }),
        ...(searchParameter.estado && { estado: ILike(`%${searchParameter.estado}%`) }),
        categoria: CategoriaPerfil.MUSICO,
        situacao: SituaçãoPerfil.ATIVO,
        deletedAt: null,
      },
      ...(searchParameter.limit && { take: searchParameter.limit }),
      skip: searchParameter.offset,
      order: {
        [searchParameter.orderBy]: searchParameter.isDESC ? 'DESC' : 'ASC',
      },
    });

    return { rows, count };
  }

  async selectById(id: string): Promise<EntidadePerfil> {
    return this.repositoryPerfil.findOne({ where: { id } });
  }

  async selectCompleteById(id: string): Promise<EntidadePerfil> {
    return this.repositoryPerfil.findOne({
      where: { id },
      relations: [
        'usuario',
        'midias',
        'apresentacoesGenero',
        'apresentacoesGenero.generoMusical',
        'apresentacoesEspecialidade',
        'apresentacoesEspecialidade.especialidade',
      ],
    });
  }

  async updateById(id: string, perfil: QueryDeepPartialEntity<EntidadePerfil>): Promise<void> {
    perfil.updatedAt = DateTime.local().toISO();

    await this.repositoryPerfil.update(id, perfil);
  }

  async selectAllByListaIdWithUsuario(listaId: string[]): Promise<EntidadePerfil[]> {
    return this.repositoryPerfil.find({
      where: { id: In(listaId) },
      relations: ['usuario'],
    });
  }
}
