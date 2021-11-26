import { FindConditions, FindOneOptions, In, Repository, getRepository } from 'typeorm';
import EntidadeApresentacaoEspecialidade from '@core/entities/apresentacao-especialidade';
import EntidadeEvento from '@core/entities/evento';
import EntidadePerfil from '@core/entities/perfil';
import { IEventoSearchParameter } from '@core/models';
import { IRepositoryEvento } from '@core/repositories/interfaces/evento';
import { injectable } from 'inversify';

@injectable()
export class RepositoryEvento implements IRepositoryEvento {
  private repositoryEvento: Repository<EntidadeEvento> = getRepository(EntidadeEvento);
  private repositoryApresentacaoEspecialidade: Repository<EntidadeApresentacaoEspecialidade> =
  getRepository(EntidadeApresentacaoEspecialidade);
  private repositoryPerfil: Repository<EntidadePerfil> = getRepository(EntidadePerfil);

  async create(evento: EntidadeEvento): Promise<EntidadeEvento> {
    return this.repositoryEvento.save(evento);
  }

  async selectOneByOptions(options: FindOneOptions<EntidadeEvento>): Promise<EntidadeEvento> {
    return this.repositoryEvento.findOne(options);
  }

  async selectAllByWhere(where: FindConditions<EntidadeEvento>): Promise<EntidadeEvento[]> {
    return this.repositoryEvento.find({ where });
  }

  async selectCompleteById(id: string): Promise<EntidadeEvento> {
    return this.repositoryEvento.findOne({
      where: { id },
      relations: [
        'contratante',
        'contratante.usuario',
        'endereco',
        'servicos',
        'servicos.generosServico',
        'servicos.generosServico.apresentacaoGenero',
        'servicos.generosServico.apresentacaoGenero.generoMusical',
        'servicos.especialidadesServico',
        'servicos.especialidadesServico.apresentacaoEspecialidade',
        'servicos.especialidadesServico.apresentacaoEspecialidade.especialidade',
      ],
    });
  }

  async selectEventosContratante(idContratante: string, searchParameter: IEventoSearchParameter):
  Promise<EntidadeEvento[]> {
    const eventos = await this.repositoryEvento
      .createQueryBuilder('evento')
      .leftJoinAndSelect('evento.servicos', 'servicos')
      .leftJoinAndSelect('servicos.avaliacao', 'avaliacao')
      .leftJoinAndSelect('servicos.especialidadesServico', 'especialidadesServico')
      .where({
        idContratante,
        deletedAt: null,
      })
      .andWhere('servicos.situacao IN(:...situacoes)',
        { situacoes: searchParameter.situacoesDosServicos })
      .andWhere('servicos.deletedAt IS NULL')
      .orderBy(`evento.${searchParameter.orderBy || 'createdAt'}`, searchParameter.isDESC ? 'DESC' : 'ASC')
      .getMany();

    const listaIdApresentaçãoEspecialidade: string[] = [];

    eventos.forEach((evento) => {
      evento.servicos.forEach((servico) => {
        const ids = servico.especialidadesServico.map(o => o.idApresentacaoEspecialidade);
        listaIdApresentaçãoEspecialidade.push(...ids);
      });
    });

    const especialidades = await this.repositoryApresentacaoEspecialidade.find({
      where: {
        id: In(listaIdApresentaçãoEspecialidade),
      },
      withDeleted: true,
    });

    const musicos = await this.repositoryPerfil.find({
      where: { id: In(especialidades.map(o => o.idMusico)) },
      relations: ['usuario'],
    });

    const eventosContratante: EntidadeEvento[] = [];
    eventos.forEach((evento) => {
      const servicos = evento.servicos.map((servico) => {
        const especialidade = especialidades
          .find(o => o.id === servico.especialidadesServico[0].idApresentacaoEspecialidade);
        const musico = musicos.find(o => o.id === especialidade.idMusico);
        musico.usuario.senha = undefined;
        servico.musico = musico;
        servico.especialidadesServico = undefined;
        return servico;
      });
      evento.servicos = servicos;

      eventosContratante.push(evento);
    });
    
    return eventosContratante;
  }
}