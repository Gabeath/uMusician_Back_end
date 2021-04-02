import {
  Column,
  Entity,
  ObjectType,
  OneToMany,
} from 'typeorm';
import Base from './base';
import EntidadeApresentacao from './apresentacao';

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
    (): ObjectType<EntidadeApresentacao> => EntidadeApresentacao,
    (apresentacao: EntidadeApresentacao): EntidadeEspecialidade => apresentacao.especialidade,
  )
  apresentacoes?: EntidadeApresentacao[];
}