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

@Entity('avaliacao')
export default class EntidadeAvaliacao extends Base {
  @Column({ type: 'int4' })
  public pontuacao!: number;

  @Column()
  public comentario?: string;

  @Column({ type: 'uuid' })
  public idPerfil!: string;

  @Column({ type: 'uuid' })
  public idServico!: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeAvaliacao[] => perfil.avaliacoes,
  )
  @JoinColumn({ name: 'idPerfil', referencedColumnName: 'id' })
  public perfil?: EntidadePerfil;

  @ManyToOne(
    (): ObjectType<EntidadeServico> => EntidadeServico,
    (servico: EntidadeServico): EntidadeAvaliacao[] => servico.avaliacoes,
  )
  @JoinColumn({ name: 'idServico', referencedColumnName: 'id' })
  public servico?: EntidadeServico;

}