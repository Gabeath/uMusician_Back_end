import {
  Between,
  In,
  Repository,
  getRepository
} from 'typeorm';
import {
  CategoriaPerfil,
  IPerfilSearchParameter,
  Pagination
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
    const medias: { idPerfil: string, media: string }[] = await this.repositoryAvaliacao
      .createQueryBuilder('avaliacao')
      .select('AVG(avaliacao.pontuacao)', 'media')
      .addSelect('avaliacao.idPerfil', 'idPerfil')
      .groupBy('avaliacao.idPerfil')
      .getRawMany();

    let avaliacoes: EntidadeAvaliacao[] = medias.map((avaliacao) => {
      return {
        idPerfil: avaliacao.idPerfil,
        pontuacao: parseFloat(avaliacao.media),
      } as EntidadeAvaliacao;
    });

    if (searchParameter.pontuacaoAvaliacao) {
      avaliacoes = avaliacoes
        .filter((avaliacao) => avaliacao.pontuacao >= searchParameter.pontuacaoAvaliacao);

      const idsPerfisAvaliacoes = avaliacoes.map((avaliacao) => {
        return avaliacao.idPerfil;
      });

      idsPerfis = idsPerfisAvaliacoes;
    }

    const generosMusicais: EntidadeGeneroMusicalPerfil[] = await this.repositoryGeneroMusicalPerfil
      .find({
        where: {
          ...(idsPerfis.length > 0 && { idPerfil: In(idsPerfis) }),
          ...(searchParameter.generoMusical && { id: searchParameter.generoMusical }),
        },
      });

    const idsPerfisGenerosMusicais = generosMusicais.map((generoMusical) => {
      return generoMusical.idPerfil;
    });

    idsPerfis = idsPerfisGenerosMusicais;

    const apresentacoes: EntidadeApresentacao[] = await this.repositoryApresentacao.find({
      where: {
        idPerfil: In(idsPerfis),
        ...(searchParameter.especialidade && { id: searchParameter.especialidade }),
        ...(searchParameter.valorMinimo && searchParameter.valorMaximo &&
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
      where: {
        id: In(idsPerfis),
        idUsuario: In(idsUsuarios),
        categoria: CategoriaPerfil.MUSICO,
        ...(searchParameter.cidade && { cidade: searchParameter.cidade }),
        ...(searchParameter.estado && { estado: searchParameter.estado }),
      },
    });

    perfis.forEach((perfil) => {
      perfil.usuario = usuarios.find((usuario) => usuario.id === perfil.idUsuario);
      perfil.generosMusicais = generosMusicais
        .filter((generoMusical) => generoMusical.idPerfil === perfil.id);
      perfil.apresentacoes = apresentacoes
        .filter((apresentacao) => apresentacao.idPerfil === perfil.id);
      perfil.avaliacoes = avaliacoes
        .filter((avaliacao) => avaliacao.idPerfil === perfil.id);
      if (perfil.avaliacoes.length === 0) {
        perfil.avaliacoes.push({
          idPerfil: perfil.id,
          pontuacao: 0,
        } as EntidadeAvaliacao);
      }
    });

    return {
      rows: perfis,
      count: perfis.length,
    };
  }
}
