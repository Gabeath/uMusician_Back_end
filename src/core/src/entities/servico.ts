import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
  OneToMany,
  OneToOne,
} from 'typeorm';
import Base from './base';
import EntidadeApresentacao from './apresentacao';
import EntidadeAvaliacao from './avaliacao';
import EntidadeEndereco from './endereco';
import EntidadeGeneroMusicalPerfil from './genero-musical-perfil';
import EntidadePerfil from './perfil';

@Entity('servico')
export default class EntidadeServico extends Base {
  @Column({ type: 'int4' })
  public situacao!: number;

  @Column()
  public nome!: string;
  
  @Column({ type: 'timestamptz' })
  public dataInicio!: string;
  
  @Column({ type: 'timestamptz' })
  public dataTermino!: string;

  @Column({ type: 'uuid' })
  public idApresentacao!: string;

  @Column({ type: 'uuid' })
  public idContratante!: string;

  @Column({ type: 'uuid' })
  public idGeneroMusical!: string;

  @Column({ type: 'float' })
  public valor!: number;

  @ManyToOne(
    (): ObjectType<EntidadeApresentacao> => EntidadeApresentacao,
    (apresentacao: EntidadeApresentacao): EntidadeServico[] => apresentacao.servicos,
  )
  @JoinColumn({ name: 'idApresentacao', referencedColumnName: 'id' })
  public apresentacao?: EntidadeApresentacao;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (contratante: EntidadePerfil): EntidadeServico[] => contratante.servicos,
  )
  @JoinColumn({ name: 'idContratante', referencedColumnName: 'id' })
  public contratante?: EntidadePerfil;

  @OneToMany(
    (): ObjectType<EntidadeAvaliacao> => EntidadeAvaliacao,
    (avaliacao: EntidadeAvaliacao): EntidadeServico => avaliacao.servico,
  )
  avaliacoes?: EntidadeAvaliacao[];

  @OneToOne(
    (): ObjectType<EntidadeEndereco> => EntidadeEndereco,
    (endereco: EntidadeEndereco): EntidadeServico => endereco.servico,
  )
  endereco?: EntidadeEndereco;

  @ManyToOne(
    (): ObjectType<EntidadeGeneroMusicalPerfil> => EntidadeGeneroMusicalPerfil,
    (generoMusical: EntidadeGeneroMusicalPerfil): EntidadeServico[] => generoMusical.servicos,
  )
  @JoinColumn({ name: 'idGeneroMusical', referencedColumnName: 'id' })
  public generoMusicalPerfil?: EntidadeGeneroMusicalPerfil;
}