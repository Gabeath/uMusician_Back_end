import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
} from 'typeorm';
import Base from './base';
import EntidadeApresentacaoEspecialidade from './apresentacao-especialidade';
import EntidadeServico from './servico';

@Entity('especialidade-servico')
export default class EntidadeEspecialidadeServico extends Base {
  @Column({ type: 'uuid' })
  public idServico!: string;

  @ManyToOne(
    (): ObjectType<EntidadeServico> => EntidadeServico,
    (servico: EntidadeServico): EntidadeEspecialidadeServico[] => servico.especialidadesServico,
  )
  @JoinColumn({ name: 'idServico', referencedColumnName: 'id' })
  servico?: EntidadeServico;

  @Column({ type: 'uuid' })
  public idApresentacaoEspecialidade!: string;

  @ManyToOne(
    (): ObjectType<EntidadeApresentacaoEspecialidade> => EntidadeApresentacaoEspecialidade,
    (apresentacaoEspecialidade: EntidadeApresentacaoEspecialidade):
    EntidadeEspecialidadeServico[] => apresentacaoEspecialidade.especialidadesServico,
  )
  @JoinColumn({ name: 'idApresentacaoEspecialidade', referencedColumnName: 'id' })
  apresentacaoEspecialidade?: EntidadeApresentacaoEspecialidade;
}