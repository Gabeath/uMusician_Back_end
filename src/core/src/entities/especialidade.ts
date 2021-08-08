import {
  Column,
  Entity,
  ObjectType,
  OneToMany,
} from 'typeorm';
import Base from './base';
import EntidadeApresentacaoEspecialidade from './apresentacao-especialidade';

@Entity('especialidade')
export default class EntidadeEspecialidade extends Base {
  @Column()
  public nome!: string;

  @Column({ type: 'int4' })
  public popularidade!: number;

  @Column({ type: 'int4' })
  public classificacao!: number;

  @Column()
  public iconeUrl!: string;

  @OneToMany(
    (): ObjectType<EntidadeApresentacaoEspecialidade> => EntidadeApresentacaoEspecialidade,
    (apresentacaoEspecialidade: EntidadeApresentacaoEspecialidade): EntidadeEspecialidade =>
      apresentacaoEspecialidade.especialidade,
  )
  apresentacoesEspecialidade?: EntidadeApresentacaoEspecialidade[];
}