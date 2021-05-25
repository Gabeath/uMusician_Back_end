import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
  OneToMany,
} from 'typeorm';
import Base from './base';
import EntidadeGeneroMusical from './genero-musical';
import EntidadePerfil from './perfil';
import EntidadeServico from './servico';

@Entity('genero-musical-perfil')
export default class EntidadeGeneroMusicalPerfil extends Base {
  @Column()
  public ano!: string;

  @Column({ type: 'uuid' })
  public idPerfil?: string;

  @Column({ type: 'uuid' })
  public idGeneroMusical!: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeGeneroMusicalPerfil[] => perfil.generosMusicais,
  )
  @JoinColumn({ name: 'idPerfil', referencedColumnName: 'id' })
  public perfil?: EntidadePerfil;

  @ManyToOne(
    (): ObjectType<EntidadeGeneroMusical> => EntidadeGeneroMusical,
    (generoMusical: EntidadeGeneroMusical): EntidadeGeneroMusicalPerfil[] => generoMusical.perfis,
  )
  @JoinColumn({ name: 'idGeneroMusical', referencedColumnName: 'id' })
  public generoMusical?: EntidadeGeneroMusical;

  @OneToMany(
    (): ObjectType<EntidadeServico> => EntidadeServico,
    (servico: EntidadeServico): EntidadeGeneroMusicalPerfil => servico.generoMusicalPerfil,
  )
  servicos?: EntidadeServico[];
}