import BusinessError, { ErrorCodes } from '@core/errors/business';
import { inject, injectable } from 'inversify';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryApresentacao } from '@core/repositories/interfaces/apresentacao';
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
  private repositoryApresentacao: IRepositoryApresentacao;
  private repositoryEndereco: IRepositoryEndereco;
  private repositoryPerfil: IRepositoryPerfil;

  constructor(
  @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
    @inject(TYPES.RepositoryApresentacao) repositoryApresentacao: IRepositoryApresentacao,
    @inject(TYPES.RepositoryEndereco) repositoryEndereco: IRepositoryEndereco,
    @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
  ) {
    this.repositoryServico = repositoryServico;
    this.repositoryApresentacao = repositoryApresentacao;
    this.repositoryEndereco = repositoryEndereco;
    this.repositoryPerfil = repositoryPerfil;
  }

  async create(idContratante: string, servico: EntidadeServico): Promise<EntidadeServico> {
    const contratante = await this.repositoryPerfil.selectById(idContratante);

    if (!contratante) {
      throw new BusinessError(ErrorCodes.PERFIL_NAO_ENCONTRADO);
    }

    const apresentacao = await this.repositoryApresentacao.selectById(servico.idApresentacao);

    if (!apresentacao) {
      throw new BusinessError(ErrorCodes.APRESENTACAO_NAO_ENCONTRADA);
    }

    const servicoToSave: EntidadeServico = {
      situacao: SituaçãoServiço.PENDENTE,
      nome: servico.nome,
      dataInicio: servico.dataInicio,
      dataTermino: servico.dataTermino,
      idApresentacao: apresentacao.id,
      idContratante: contratante.id,
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

    return this.repositoryServico.selectServicosByWhere({
      where: {
        idContratante,
        situacao: In([SituaçãoServiço.PENDENTE, SituaçãoServiço.ACEITO]),
      },
      relations: [
        'apresentacao',
        'apresentacao.perfil',
        'apresentacao.perfil.usuario',
      ]
    });
  }

  async getDetalhesServico(id: string): Promise<EntidadeServico | null> {
    const servico = await this.repositoryServico.selectById(id);

    servico.apresentacao.perfil.usuario.senha = undefined;
    servico.contratante.usuario.senha = undefined;

    return servico;
  }
}