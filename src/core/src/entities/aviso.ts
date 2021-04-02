import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
} from 'typeorm';
import Base from './base';
import EntidadePerfil from './perfil';

@Entity('aviso')
export default class EntidadeAviso extends Base {
  @Column({ type: 'date' })
  public data!: string;

  @Column({ type: 'uuid' })
  public idPerfil!: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeAviso[] => perfil.avisos,
  )
  @JoinColumn({ name: 'idPerfil', referencedColumnName: 'id' })
  public perfil?: EntidadePerfil;

}