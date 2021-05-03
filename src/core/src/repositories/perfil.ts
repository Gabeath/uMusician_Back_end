import {
  Between,
  In,
  Repository,
  getRepository
} from 'typeorm';
import {
  CategoriaPerfil,
  IPerfilSearchParameter,
  Pagination,
  SituaçãoPerfil,
} from '@core/models';
import EntidadeApresentacao from '@core/entities/apresentacao';
import EntidadeAvaliacao from '@core/entities/avaliacao';
import EntidadeGeneroMusicalPerfil from '@core/entities/genero-musical-perfil';
import EntidadePerfil from '@core/entities/perfil';
import EntidadeUsuario from '@core/entities/usuario';
import { IRepositoryPerfil } from './interfaces/perfil';
import { injectable } from 'inversify';

@injectable()
export class RepositoryPerfil implements IRepositoryPerfil {
  private repositoryPerfil: Repository<EntidadePerfil> = getRepository(EntidadePerfil);
  private repositoryAvaliacao: Repository<EntidadeAvaliacao> = getRepository(EntidadeAvaliacao);
  private repositoryApresentacao: Repository<EntidadeApresentacao> =
  getRepository(EntidadeApresentacao);
  private repositoryGeneroMusicalPerfil: Repository<EntidadeGeneroMusicalPerfil> =
  getRepository(EntidadeGeneroMusicalPerfil);
  private repositoryUsuario: Repository<EntidadeUsuario> = getRepository(EntidadeUsuario);

  async getMusicosWithSearchParameters(searchParameter: IPerfilSearchParameter):
  Promise<Pagination<EntidadePerfil>> {
    let idsPerfis: string[] = [];
    let medias: { idPerfil: string, media: string }[] = await this.repositoryAvaliacao
      .createQueryBuilder('avaliacao')
      .select('AVG(avaliacao.pontuacao)', 'media')
      .addSelect('avaliacao.idPerfil', 'idPerfil')
      .groupBy('avaliacao.idPerfil')
      .getRawMany();

    if (searchParameter.pontuacaoAvaliacao) {
      medias = medias
        .filter((avaliacao) => parseFloat(avaliacao.media) >= searchParameter.pontuacaoAvaliacao);

      const idsPerfisAvaliacoes = medias.map((avaliacao) => {
        return avaliacao.idPerfil;
      });

      idsPerfis = idsPerfisAvaliacoes;
    }

    const generosMusicais: EntidadeGeneroMusicalPerfil[] = await this.repositoryGeneroMusicalPerfil
      .find({
        where: {
          ...(idsPerfis.length > 0 && { idPerfil: In(idsPerfis) }),
          ...(searchParameter.generoMusical && { idGeneroMusical: searchParameter.generoMusical }),
        },
      });

    const idsPerfisGenerosMusicais = generosMusicais.map((generoMusical) => {
      return generoMusical.idPerfil;
    });

    idsPerfis = idsPerfisGenerosMusicais;
    
    const apresentacoes: EntidadeApresentacao[] = await this.repositoryApresentacao.find({
      where: {
        idPerfil: In(idsPerfis),
        ...(searchParameter.especialidade && { idEspecialidade: searchParameter.especialidade }),
        ...((searchParameter.valorMinimo || searchParameter.valorMinimo == 0) &&
          (searchParameter.valorMaximo || searchParameter.valorMaximo === 0) &&
          { valorHora: Between(searchParameter.valorMinimo, searchParameter.valorMaximo) }),
      },
    });

    const idsPerfisApresentacoes = apresentacoes.map((apresentacao) => {
      return apresentacao.idPerfil;
    });

    idsPerfis = idsPerfisApresentacoes;

    const usuarios: EntidadeUsuario[] = await this.repositoryUsuario
      .createQueryBuilder('usuario')
      .select('usuario.id', 'id')
      .addSelect('usuario.nome', 'nome')
      .addSelect('usuario.fotoUrl', 'fotoUrl')
      .where('LOWER(usuario.nome) LIKE :nome',
        { nome: `%${searchParameter.nome && searchParameter.nome.toLowerCase() || ''}%`})
      .getRawMany();

    const idsUsuarios: string[] = usuarios.map((usuario) => {
      return usuario.id;
    });

    const perfis: EntidadePerfil[] = await this.repositoryPerfil.find({
      select: ['id', 'cidade', 'estado', 'idUsuario'],
      where: {
        id: In(idsPerfis),
        idUsuario: In(idsUsuarios),
        categoria: CategoriaPerfil.MUSICO,
        situacao: SituaçãoPerfil.ATIVO,
        ...(searchParameter.cidade && { cidade: searchParameter.cidade }),
        ...(searchParameter.estado && { estado: searchParameter.estado }),
      },
    });

    perfis.forEach((perfil) => {
      perfil.usuario = usuarios.find((usuario) => usuario.id === perfil.idUsuario);
      const avaliacaoMedia = medias
        .find((avaliacao) => avaliacao.idPerfil === perfil.id);
      perfil.avaliacaoMedia = avaliacaoMedia ? parseFloat(avaliacaoMedia.media) : 0;
      perfil.idUsuario = undefined;
    });

    return {
      rows: perfis,
      count: perfis.length,
    };
  }
}
