import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
  OneToMany,
} from 'typeorm';
import Base from './base';
import EntidadeApresentacao from './apresentacao';
import EntidadeAvaliacao from './avaliacao';
import EntidadeAviso from './aviso';
import EntidadeGeneroMusicalPerfil from './genero-musical-perfil';
import EntidadeMidia from './midia';
import EntidadeServico from './servico';
import EntidadeUsuario from './usuario';

@Entity('perfil')
export default class EntidadePerfil extends Base {
  @Column({ type: 'int4' })
  public situacao?: number;

  @Column({ type: 'int4' })
  public categoria!: number;

  @Column()
  public cidade?: string;

  @Column()
  public estado?: string;

  @Column()
  public biografia?: string;

  @Column({ type: 'uuid' })
  public idUsuario?: string;

  @ManyToOne(
    (): ObjectType<EntidadeUsuario> => EntidadeUsuario,
    (usuario: EntidadeUsuario): EntidadePerfil[] => usuario.perfis,
  )
  @JoinColumn({ name: 'idUsuario', referencedColumnName: 'id' })
  public usuario?: EntidadeUsuario;

  @OneToMany(
    (): ObjectType<EntidadeAviso> => EntidadeAviso,
    (aviso: EntidadeAviso): EntidadePerfil => aviso.perfil,
  )
  avisos?: EntidadeAviso[];

  @OneToMany(
    (): ObjectType<EntidadeMidia> => EntidadeMidia,
    (midia: EntidadeMidia): EntidadePerfil => midia.perfil,
  )
  midias?: EntidadeMidia[];

  @OneToMany(
    (): ObjectType<EntidadeGeneroMusicalPerfil> => EntidadeGeneroMusicalPerfil,
    (generoMusical: EntidadeGeneroMusicalPerfil): EntidadePerfil => generoMusical.perfil,
  )
  generosMusicais?: EntidadeGeneroMusicalPerfil[];

  @OneToMany(
    (): ObjectType<EntidadeApresentacao> => EntidadeApresentacao,
    (apresentacao: EntidadeApresentacao): EntidadePerfil => apresentacao.perfil,
  )
  apresentacoes?: EntidadeApresentacao[];

  @OneToMany(
    (): ObjectType<EntidadeAvaliacao> => EntidadeAvaliacao,
    (avaliacao: EntidadeAvaliacao): EntidadePerfil => avaliacao.perfil,
  )
  avaliacoes?: EntidadeAvaliacao[];

  avaliacaoMedia?: number;

  @OneToMany(
    (): ObjectType<EntidadeServico> => EntidadeServico,
    (servico: EntidadeServico): EntidadePerfil => servico.contratante,
  )
  servicos?: EntidadeServico[];

  countServicos?: number;
}