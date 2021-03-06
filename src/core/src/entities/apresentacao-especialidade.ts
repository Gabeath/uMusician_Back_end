import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
  OneToMany,
} from 'typeorm';
import Base from './base';
import EntidadeEspecialidade from './especialidade';
import EntidadeEspecialidadeServico from './especialidade-servico';
import EntidadePerfil from './perfil';

@Entity('apresentacao-especialidade')
export default class EntidadeApresentacaoEspecialidade extends Base {
  @Column()
  public ano!: string;
  
  @Column()
  public valorHora!: number;

  @Column({ type: 'uuid' })
  public idMusico?: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (musico: EntidadePerfil): EntidadeApresentacaoEspecialidade[] =>
      musico.apresentacoesEspecialidade,
  )
  @JoinColumn({ name: 'idMusico', referencedColumnName: 'id' })
  public musico?: EntidadePerfil;

  @Column({ type: 'uuid' })
  public idEspecialidade!: string;

  @ManyToOne(
    (): ObjectType<EntidadeEspecialidade> => EntidadeEspecialidade,
    (especialidade: EntidadeEspecialidade): EntidadeApresentacaoEspecialidade[] =>
      especialidade.apresentacoesEspecialidade,
  )
  @JoinColumn({ name: 'idEspecialidade', referencedColumnName: 'id' })
  public especialidade?: EntidadeEspecialidade;

  @OneToMany(
    (): ObjectType<EntidadeEspecialidadeServico> => EntidadeEspecialidadeServico,
    (especialidadeServico: EntidadeEspecialidadeServico): EntidadeApresentacaoEspecialidade =>
      especialidadeServico.apresentacaoEspecialidade,
  )
  especialidadesServico?: EntidadeEspecialidadeServico[];
}