import EntidadeEspecialidadeServico from '@core/entities/especialidade-servico';

export interface IRepositoryEspecialidadeServico {
  create(especialidadesServico: EntidadeEspecialidadeServico[]): Promise<EntidadeEspecialidadeServico[]>;
}