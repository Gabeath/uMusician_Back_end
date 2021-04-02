import {
  Column,
  Entity,
  ObjectType,
  OneToMany,
} from 'typeorm';
import Base from './base';
import EntidadeGeneroMusicalPerfil from './genero-musical-perfil';

@Entity('genero-musical')
export default class EntidadeGeneroMusical extends Base {
  @Column()
  public nome!: string;

  @Column({ type: 'int4' })
  public popularidade!: number;

  @Column()
  public iconeUrl?: string;

  @OneToMany(
    (): ObjectType<EntidadeGeneroMusicalPerfil> => EntidadeGeneroMusicalPerfil,
    (perfil: EntidadeGeneroMusicalPerfil): EntidadeGeneroMusical => perfil.generoMusical,
  )
  perfis?: EntidadeGeneroMusicalPerfil[];
}