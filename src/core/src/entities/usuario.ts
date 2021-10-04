import {
  Column,
  Entity,
  ObjectType,
  OneToMany,
} from 'typeorm';
import Base from './base';
import EntidadePerfil from './perfil';
import EntidadeSolicitacao from './solicitacao';

@Entity('usuario')
export default class EntidadeUsuario extends Base {
  @Column()
  public email?: string;

  @Column()
  public senha?: string;
  
  @Column()
  public nome?: string;
  
  @Column()
  public cpf?: string;
  
  @Column({ type: 'int4' })
  public genero?: number;
  
  @Column({ type: 'date' })
  public dataNascimento?: string;
  
  @Column()
  public fotoUrl?: string;

  @OneToMany(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeUsuario => perfil.usuario,
  )
  perfis?: EntidadePerfil[];

  @OneToMany(
    (): ObjectType<EntidadeSolicitacao> => EntidadeSolicitacao,
    (solicitacao: EntidadeSolicitacao): EntidadeUsuario => solicitacao.usuario,
  )
  solicitacoes?: EntidadeSolicitacao[];
}