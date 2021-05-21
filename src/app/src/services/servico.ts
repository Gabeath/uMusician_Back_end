import BusinessError, { ErrorCodes } from '@core/errors/business';
import { inject, injectable } from 'inversify';
import EntidadeEndereco from '@core/entities/endereco';
import EntidadeServico from '@core/entities/servico';
import { IRepositoryApresentacao } from '@core/repositories/interfaces/apresentacao';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IServiceServico } from '@app/services/interfaces/servico';
import { SituaçãoServiço } from '@core/models';
import TYPES from '@core/types';

@injectable()
export class ServiceServico implements IServiceServico {
  private repositoryServico: IRepositoryServico;
  private repositoryApresentacao: IRepositoryApresentacao;
  private repositoryPerfil: IRepositoryPerfil;

  constructor(
  @inject(TYPES.RepositoryServico) repositoryServico: IRepositoryServico,
    @inject(TYPES.RepositoryApresentacao) repositoryApresentacao: IRepositoryApresentacao,
    @inject(TYPES.RepositoryPerfil) repositoryPerfil: IRepositoryPerfil,
  ) {
    this.repositoryServico = repositoryServico;
    this.repositoryApresentacao = repositoryApresentacao;
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
      dataInicio: servico.dataInicio,
      dataTermino: servico.dataTermino,
      idApresentacao: apresentacao.id,
      idContratante: contratante.id,
      endereco: {
        cep: servico.endereco.cep,
        rua: servico.endereco.rua,
        bairro: servico.endereco.bairro,
        cidade: servico.endereco.cidade,
        estado: servico.endereco.estado,
        numero: servico.endereco.numero,
        pais: servico.endereco.pais,
        complemento: servico.endereco.complemento,
        createdBy: contratante.id,
      } as EntidadeEndereco,
      createdBy: contratante.id,
    };

    return this.repositoryServico.create(servicoToSave);
  }
}