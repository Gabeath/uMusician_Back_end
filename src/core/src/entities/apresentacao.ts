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
import EntidadePerfil from './perfil';
import EntidadeServico from './servico';

@Entity('apresentacao')
export default class EntidadeApresentacao extends Base {
  @Column()
  public ano!: string;
  
  @Column()
  public valorHora!: number;

  @Column({ type: 'uuid' })
  public idPerfil?: string;

  @Column({ type: 'uuid' })
  public idEspecialidade!: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeApresentacao[] => perfil.apresentacoes,
  )
  @JoinColumn({ name: 'idPerfil', referencedColumnName: 'id' })
  public perfil?: EntidadePerfil;

  @ManyToOne(
    (): ObjectType<EntidadeEspecialidade> => EntidadeEspecialidade,
    (especialidade: EntidadeEspecialidade): EntidadeApresentacao[] => especialidade.apresentacoes,
  )
  @JoinColumn({ name: 'idEspecialidade', referencedColumnName: 'id' })
  public especialidade?: EntidadeEspecialidade;

  @OneToMany(
    (): ObjectType<EntidadeServico> => EntidadeServico,
    (servico: EntidadeServico): EntidadeApresentacao => servico.apresentacao,
  )
  servicos?: EntidadeServico[];
}