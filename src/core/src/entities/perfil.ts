import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
  OneToMany,
} from 'typeorm';
import Base from './base';
import EntidadeApresentacaoEspecialidade from './apresentacao-especialidade';
import EntidadeApresentacaoGenero from './apresentacao-genero';
import EntidadeAvaliacao from './avaliacao';
import EntidadeAviso from './aviso';
import EntidadeConfirmacaoPresenca from './confirmacao-presenca';
import EntidadeEvento from './evento';
import EntidadeMidia from './midia';
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
    (midia: EntidadeMidia): EntidadePerfil => midia.musico,
  )
  midias?: EntidadeMidia[];

  @OneToMany(
    (): ObjectType<EntidadeApresentacaoGenero> => EntidadeApresentacaoGenero,
    (apresentacaoGenero: EntidadeApresentacaoGenero): EntidadePerfil => apresentacaoGenero.musico,
  )
  apresentacoesGenero?: EntidadeApresentacaoGenero[];

  @OneToMany(
    (): ObjectType<EntidadeApresentacaoEspecialidade> => EntidadeApresentacaoEspecialidade,
    (apresentacao: EntidadeApresentacaoEspecialidade): EntidadePerfil => apresentacao.musico,
  )
  apresentacoesEspecialidade?: EntidadeApresentacaoEspecialidade[];

  @OneToMany(
    (): ObjectType<EntidadeEvento> => EntidadeEvento,
    (evento: EntidadeEvento): EntidadePerfil => evento.contratante,
  )
  eventos?: EntidadeEvento[];

  @OneToMany(
    (): ObjectType<EntidadeConfirmacaoPresenca> => EntidadeConfirmacaoPresenca,
    (confirmacaoPresenca: EntidadeConfirmacaoPresenca): EntidadePerfil => confirmacaoPresenca.musico,
  )
  confirmacoesPresencaMusico?: EntidadeConfirmacaoPresenca[];

  @OneToMany(
    (): ObjectType<EntidadeConfirmacaoPresenca> => EntidadeConfirmacaoPresenca,
    (confirmacaoPresenca: EntidadeConfirmacaoPresenca): EntidadePerfil => confirmacaoPresenca.contratante,
  )
  confirmacoesPresencaContratante?: EntidadeConfirmacaoPresenca[];

  @OneToMany(
    (): ObjectType<EntidadeAvaliacao> => EntidadeAvaliacao,
    (avaliacao: EntidadeAvaliacao): EntidadePerfil => avaliacao.musico,
  )
  avaliacoes?: EntidadeAvaliacao[];

  countServicos?: number;

  avaliacaoMedia?: number;
}