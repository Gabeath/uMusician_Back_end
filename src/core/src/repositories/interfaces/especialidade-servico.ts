import EntidadeEspecialidadeServico from '@core/entities/especialidade-servico';

export interface IRepositoryEspecialidadeServico {
  create(especialidadeServico: EntidadeEspecialidadeServico): Promise<EntidadeEspecialidadeServico>;
}