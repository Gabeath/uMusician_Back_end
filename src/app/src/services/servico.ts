import BusinessError, { ErrorCodes } from '@core/errors/business';
import { inject, injectable } from 'inversify';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryApresentacaoGenero } from '@core/repositories/interfaces/apresentacao-genero';
import { IRepositoryEndereco } from '@core/repositories/interfaces/endereco';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceServico } from '@app/services/interfaces/servico';
import { In } from 'typeorm';
import { SituaçãoServiço } from '@core/models';
import TYPES from '@core/types';

@injectable()
export class ServiceServico implements IServiceServico {
  private repositoryServico: IRepositoryServico;
  private repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade;
  private repositoryEndereco: IRepositoryEndereco;
  private repositoryApresentacaoGenero: IRepositoryApresentacaoGenero;
  private repositoryPerfil: IRepositoryPerfil;

  constructor(
  @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
    @inject(TYPES.RepositoryApresentacaoEspecialidade)
    repositoryApresentacaoEspecialidade: IRepositoryApresentacaoEspecialidade,
    @inject(TYPES.RepositoryEndereco) repositoryEndereco: IRepositoryEndereco,
    @inject(TYPES.RepositoryApresentacaoGenero)
    repositoryApresentacaoGenero: IRepositoryApresentacaoGenero,
    @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
  ) {
    this.repositoryServico = repositoryServico;
    this.repositoryApresentacaoEspecialidade = repositoryApresentacaoEspecialidade;
    this.repositoryEndereco = repositoryEndereco;
    this.repositoryApresentacaoGenero = repositoryApresentacaoGenero;
    this.repositoryPerfil = repositoryPerfil;
  }

  async create(idContratante: string, servico: EntidadeServico): Promise<EntidadeServico> {
    const contratante = await this.repositoryPerfil.selectById(idContratante);

    if (!contratante) {
      throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO);
    }

    const apresentacao = await this.repositoryApresentacaoEspecialidade.selectById(servico.idApresentacao);

    if (!apresentacao) {
      throw new BusinessError(ErrorCodes.APRESENTACAO_NAO_ENCONTRADA);
    }

    const generoMusicalPerfil = await this.repositoryApresentacaoGenero
      .selectById(servico.idGeneroMusical);

    if (!generoMusicalPerfil) {
      throw new BusinessError(ErrorCodes.GENERO_MUSICAL_NAO_ENCONTRADO);
    }

    if (apresentacao.idPerfil !== generoMusicalPerfil.idPerfil) {
      throw new BusinessError(ErrorCodes.ARGUMENTOS_INVALIDOS);
    }

    const servicoToSave: EntidadeServico = {
      situacao: SituaçãoServiço.PENDENTE,
      nome: servico.nome,
      dataInicio: servico.dataInicio,
      dataTermino: servico.dataTermino,
      valor: servico.valor,
      idApresentacao: apresentacao.id,
      idContratante: contratante.id,
      idGeneroMusical: generoMusicalPerfil.id,
      createdBy: contratante.id,
    };

    const servicoSaved = await this.repositoryServico.create(servicoToSave);

    const enderecoSaved = await this.repositoryEndereco.create({
      idServico: servicoSaved.id,
      cep: servico.endereco.cep,
      rua: servico.endereco.rua,
      bairro: servico.endereco.bairro,
      cidade: servico.endereco.cidade,
      estado: servico.endereco.estado,
      numero: servico.endereco.numero,
      pais: servico.endereco.pais,
      complemento: servico.endereco.complemento,
      createdBy: contratante.id,
    });

    servicoSaved.endereco = enderecoSaved;

    return servicoSaved;
  }

  async getServicosContratante(idContratante: string): Promise<EntidadeServico[]> {
    const contratante = await this.repositoryPerfil.selectById(idContratante);

    if (!contratante) {
      throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO);
    }

    return this.repositoryServico.selectAllByWhere({
      where: {
        idContratante,
        situacao: In([SituaçãoServiço.PENDENTE, SituaçãoServiço.ACEITO]),
      },
      relations: [
        'apresentacao',
        'apresentacao.perfil',
        'apresentacao.perfil.usuario',
      ],
      order: {
        dataInicio: 'ASC'
      }
    });
  }

  async getDetalhesServico(id: string): Promise<EntidadeServico | null> {
    const servico = await this.repositoryServico.selectById(id);

    servico.apresentacao.perfil.usuario.senha = undefined;
    servico.contratante.usuario.senha = undefined;

    return servico;
  }

  async countServicosConcluidos(idMusico: string): Promise<number> {
    const apresentacoesEspecialidade = await this.repositoryApresentacaoEspecialidade
      .selectByIdMusicoWithEspecialidadeServico(idMusico);

    const listaIdServico: string[] = [];
    apresentacoesEspecialidade.forEach((apresentacao) => {
      apresentacao.especialidadesServico.forEach(servico => listaIdServico.push(servico.idServico));
    });

    const servicos = await this.repositoryServico.selectAllByWhere({
      id: In(listaIdServico),
      situacao: SituaçãoServiço.CONCLUÍDO,
      deletedAt: null,
    });

    return servicos.length;
  }
}