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

  async create(perfil: EntidadePerfil): Promise<EntidadePerfil> {
    return this.repositoryPerfil.save(perfil);
  }

  async selectMusicosWithSearchParameters(searchParameter: IMusicoSearchParameter):
  Promise<Pagination<EntidadePerfil>> {
    const [ rows, count ] = await this.repositoryPerfil
      .createQueryBuilder('perfil')
      .leftJoinAndSelect('perfil.usuario', 'usuario')
      .where({
        ...(searchParameter.listaIdMusico && { id: In(searchParameter.listaIdMusico) }),
        ...(searchParameter.listaIdUsuario && { idUsuario: In(searchParameter.listaIdUsuario) }),
        ...(searchParameter.cidade && { cidade: ILike(`%${searchParameter.cidade}%`) }),
        ...(searchParameter.estado && { estado: ILike(`%${searchParameter.estado}%`) }),
        categoria: CategoriaPerfil.MUSICO,
        situacao: SituaçãoPerfil.ATIVO,
        deletedAt: null,
      })
      .andWhere('UNACCENT(usuario.nome) LIKE UNACCENT(:nome)', { nome: `%${searchParameter.nome || ''}%` })
      .take(searchParameter.limit || 10)
      .skip(searchParameter.offset || 0)
      .orderBy(`perfil.${searchParameter.orderBy || 'createdAt'}`, searchParameter.isDESC ? 'DESC' : 'ASC')
      .getManyAndCount();

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

  async selectByIdWithUsuario(id: string): Promise<EntidadePerfil> {
    return this.repositoryPerfil.findOne({
      where: { id },
      relations: ['usuario'],
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
