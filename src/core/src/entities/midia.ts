import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
} from 'typeorm';
import Base from './base';
import EntidadePerfil from './perfil';

@Entity('midia')
export default class EntidadeMidia extends Base {
  @Column({ type: 'int4' })
  public tipo!: number;

  @Column()
  public url!: string;

  @Column()
  public titulo!: string;

  @Column()
  public ano!: string;

  @Column({ type: 'uuid' })
  public idMusico!: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (musico: EntidadePerfil): EntidadeMidia[] => musico.midias,
  )
  @JoinColumn({ name: 'idMusico', referencedColumnName: 'id' })
  public musico?: EntidadePerfil;
}