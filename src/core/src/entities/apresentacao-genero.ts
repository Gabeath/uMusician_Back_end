import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
} from 'typeorm';
import Base from './base';
import EntidadeGeneroMusical from './genero-musical';
import EntidadePerfil from './perfil';

@Entity('genero-musical-perfil')
export default class EntidadeApresentacaoGenero extends Base {
  @Column()
  public ano!: string;

  @Column({ type: 'uuid' })
  public idMusico?: string;

  @Column({ type: 'uuid' })
  public idGeneroMusical!: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeApresentacaoGenero[] => perfil.apresentacoesGenero,
  )
  @JoinColumn({ name: 'idMusico', referencedColumnName: 'id' })
  public musico?: EntidadePerfil;

  @ManyToOne(
    (): ObjectType<EntidadeGeneroMusical> => EntidadeGeneroMusical,
    (generoMusical: EntidadeGeneroMusical): EntidadeApresentacaoGenero[] =>
      generoMusical.apresentacoesGenero,
  )
  @JoinColumn({ name: 'idGeneroMusical', referencedColumnName: 'id' })
  public generoMusical?: EntidadeGeneroMusical;

  // @OneToMany(
  //   (): ObjectType<EntidadeServico> => EntidadeServico,
  //   (servico: EntidadeServico): EntidadeApresentacaoGenero => servico.apresentacoesGenero,
  // )
  // servicos?: EntidadeServico[];
}