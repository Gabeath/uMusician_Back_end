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
  public idPerfil!: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeMidia[] => perfil.midias,
  )
  @JoinColumn({ name: 'idPerfil', referencedColumnName: 'id' })
  public perfil?: EntidadePerfil;
}