import BusinessError, { ErrorCodes } from '@core/errors/business';
import { IEventoSearchParameter, SituaçãoServiço } from '@core/models';
import { inject, injectable } from 'inversify';
import EntidadeEvento from '@core/entities/evento';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryEndereco } from '@core/repositories/interfaces/endereco';
import { IRepositoryEspecialidadeServico } from '@core/repositories/interfaces/especialidade-servico';
import { IRepositoryEvento } from '@core/repositories/interfaces/evento';
import { IRepositoryGeneroServico } from '@core/repositories/interfaces/genero-servico';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceEvento } from './interfaces/evento';
import TYPES from '@core/types';

@injectable()
export class ServiceEvento implements IServiceEvento {
  private repositoryEvento: IRepositoryEvento;
  private repositoryEndereco: IRepositoryEndereco;
  private repositoryEspecialidadeServico: IRepositoryEspecialidadeServico;
  private repositoryGeneroServico: IRepositoryGeneroServico;
  private repositoryPerfil: IRepositoryPerfil;
  private repositoryServico: IRepositoryServico;

  constructor(
  @inject(TYPES.RepositoryEvento) repositoryEvento: IRepositoryEvento,
    @inject(TYPES.RepositoryEndereco) repositoryEndereco: IRepositoryEndereco,
    @inject(TYPES.RepositoryEspecialidadeServico) repositoryEspecialidadeServico: IRepositoryEspecialidadeServico,
    @inject(TYPES.RepositoryGeneroServico) repositoryGeneroServico: IRepositoryGeneroServico,
    @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
    @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
  ) {
    this.repositoryEvento = repositoryEvento;
    this.repositoryEndereco = repositoryEndereco;
    this.repositoryEspecialidadeServico = repositoryEspecialidadeServico;
    this.repositoryGeneroServico = repositoryGeneroServico;
    this.repositoryPerfil = repositoryPerfil;
    this.repositoryServico = repositoryServico;
  }

  async create(idContratante: string, evento: EntidadeEvento): Promise<EntidadeEvento> {
    const contratante = await this.repositoryPerfil.selectById(idContratante);

    if (!contratante) {
      throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO);
    }

    if (!evento.endereco || !evento.servicos || evento.servicos.length <= 0) {
      throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);
    }

    evento.servicos.forEach(o => {
      if (!o.valor || !o.especialidadesServico || !o.generosServico
        || o.especialidadesServico.length <= 0 || o.generosServico.length <=0) {
        throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);
      }

      o.especialidadesServico.forEach(especialidadeServico => {
        if (!especialidadeServico.idApresentacaoEspecialidade) {
          throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);
        }
      });

      o.generosServico.forEach(generoServico => {
        if (!generoServico.idApresentacaoGenero) {
          throw new BusinessError(ErrorCodes.ARGUMENTOS_AUSENTES);
        }
      });
    });

    const eventoSaved = await this.repositoryEvento.create({
      idContratante: contratante.id,
      dataInicio: evento.dataInicio,
      dataTermino: evento.dataTermino,
      nome: evento.nome,
    });

    const enderecoSaved = await this.repositoryEndereco.create({
      idEvento: eventoSaved.id,
      bairro: evento.endereco.bairro,
      cep: evento.endereco.cep,
      cidade: evento.endereco.cidade,
      estado: evento.endereco.estado,
      numero: evento.endereco.numero,
      pais: evento.endereco.pais,
      rua: evento.endereco.rua,
      complemento: evento.endereco.complemento,
    });

    const servicosSaved: EntidadeServico[] = await Promise.all(evento.servicos.map(async (o) => {
      const servico = await this.repositoryServico.create({
        idEvento: eventoSaved.id,
        situacao: SituaçãoServiço.PENDENTE,
        valor: o.valor,
      });

      const especialidadesServico = await this.repositoryEspecialidadeServico
        .create(o.especialidadesServico.map((especialidadeServico) => {
          return {
            idServico: servico.id,
            idApresentacaoEspecialidade: especialidadeServico.idApresentacaoEspecialidade,
          };
        }));

      const generosServico = await this.repositoryGeneroServico
        .create(o.generosServico.map((generoServico) => {
          return {
            idServico: servico.id,
            idApresentacaoGenero: generoServico.idApresentacaoGenero,
          };
        }));

      return {
        ...servico,
        especialidadesServico,
        generosServico,
      };
    }));

    return {
      ...eventoSaved,
      contratante,
      endereco: enderecoSaved,
      servicos: servicosSaved,
    };
  }

  async getEventosByIdContratante(idContratante: string, searchParameter: IEventoSearchParameter):
  Promise<EntidadeEvento[]> {
    const contratante = await this.repositoryPerfil.selectById(idContratante);

    if (!contratante) {
      throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO);
    }

    const eventos = await this.repositoryEvento.selectEventosContratante(contratante.id, searchParameter);

    const listaIdMusico: string[] = [];
    eventos.forEach((evento) => {
      const ids = evento.servicos.map(o => o.especialidadesServico[0].apresentacaoEspecialidade.idMusico);
      listaIdMusico.push(...ids);
    });
    
    const musicos = await this.repositoryPerfil.selectAllByListaIdWithUsuario(listaIdMusico);

    const eventosContratante: EntidadeEvento[] = [];
    eventos.forEach((evento) => {
      const servicos = evento.servicos.map((servico) => {
        const musico = musicos.find(o => o.id === servico.especialidadesServico[0].apresentacaoEspecialidade.idMusico);
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

  async getDetalhesEvento(id: string): Promise<EntidadeEvento> {
    const evento = await this.repositoryEvento.selectCompleteById(id);

    if (!evento) { throw new BusinessError(ErrorCodes.EVENTO_NAO_ENCONTRADO); }

    evento.contratante.usuario.senha = undefined;

    const listaIdMusico = evento.servicos.map(o => o.especialidadesServico[0].apresentacaoEspecialidade.idMusico);
    const musicos = await this.repositoryPerfil.selectAllByListaIdWithUsuario(listaIdMusico);

    const servicos = evento.servicos.map((servico) => {
      const musico = musicos.find(o => o.id === servico.especialidadesServico[0].apresentacaoEspecialidade.idMusico);
      musico.usuario.senha = undefined;
      servico.musico = musico;
      return servico;
    });

    evento.servicos = servicos;

    return evento;
  }
}