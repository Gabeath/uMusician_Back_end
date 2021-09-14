import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
} from 'typeorm';
import Base from './base';
import EntidadePerfil from './perfil';
import EntidadeServico from './servico';

@Entity('confirmacao-presenca')
export default class EntidadeConfirmacaoPresenca extends Base {
  @Column({ type: 'uuid' })
  public idMusico?: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeConfirmacaoPresenca[] => perfil.confirmacoesPresencaMusico,
  )
  @JoinColumn({ name: 'idMusico', referencedColumnName: 'id' })
  public musico?: EntidadePerfil;
  
  @Column({ type: 'uuid' })
  public idContratante?: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeConfirmacaoPresenca[] => perfil.confirmacoesPresencaContratante,
  )
  @JoinColumn({ name: 'idContratante', referencedColumnName: 'id' })
  public contratante?: EntidadePerfil;
  
  @Column({ type: 'uuid' })
  public idServico!: string;

  @ManyToOne(
    (): ObjectType<EntidadeServico> => EntidadeServico,
    (servico: EntidadeServico): EntidadeConfirmacaoPresenca[] => servico.confirmacoesPresenca,
  )
  @JoinColumn({ name: 'idServico', referencedColumnName: 'id' })
  servico?: EntidadeServico;
  
  @Column()
  public codigo?: string;
  
  @Column({ type: 'int4' })
  public status?: number;
}