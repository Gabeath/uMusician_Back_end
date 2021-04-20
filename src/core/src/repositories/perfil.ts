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
    let medias: { idPerfil: string, media: string }[] = await this.repositoryAvaliacao
      .createQueryBuilder('avaliacao')
      .select('AVG(avaliacao.pontuacao)', 'media')
      .addSelect('avaliacao.idPerfil', 'idPerfil')
      .groupBy('avaliacao.idPerfil')
      .getRawMany();

    if (searchParameter.pontuacaoAvaliacao) {
      medias = medias
        .filter((avaliacao) => parseFloat(avaliacao.media) >= searchParameter.pontuacaoAvaliacao);
    }

    const avaliacoes: EntidadeAvaliacao[] = medias.map((avaliacao) => {
      return {
        idPerfil: avaliacao.idPerfil,
        pontuacao: parseFloat(avaliacao.media),
      } as EntidadeAvaliacao;
    });

    const generosMusicais: EntidadeGeneroMusicalPerfil[] = await this.repositoryGeneroMusicalPerfil
      .find({
        where: {
          ...(searchParameter.generoMusical && { id: searchParameter.generoMusical }),
        }
      });

    const apresentacoes: EntidadeApresentacao[] = await this.repositoryApresentacao.find({
      where: {
        ...(searchParameter.especialidade && { id: searchParameter.especialidade }),
        ...(searchParameter.valorMinimo && searchParameter.valorMaximo &&
          { valorHora: Between(searchParameter.valorMinimo, searchParameter.valorMaximo) }),
      }
    });

    const idsPerfis: string[] = [];
    avaliacoes.forEach((avaliacao) => {
      if (!idsPerfis.find((idPerfil) => idPerfil === avaliacao.idPerfil)) {
        idsPerfis.push(avaliacao.idPerfil);
      }
    });
    generosMusicais.forEach((generoMusical) => {
      if (!idsPerfis.find((idPerfil) => idPerfil === generoMusical.idPerfil)) {
        idsPerfis.push(generoMusical.idPerfil);
      }
    });
    apresentacoes.forEach((apresentacao) => {
      if (!idsPerfis.find((idPerfil) => idPerfil === apresentacao.idPerfil)) {
        idsPerfis.push(apresentacao.idPerfil);
      }
    });

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
      }
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
