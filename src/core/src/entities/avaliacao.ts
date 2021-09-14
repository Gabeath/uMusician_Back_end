import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
  OneToOne,
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
  public idServico!: string;

  @OneToOne(
    (): ObjectType<EntidadeServico> => EntidadeServico,
    (servico: EntidadeServico): EntidadeAvaliacao => servico.avaliacao,
  )
  @JoinColumn({ name: 'idServico', referencedColumnName: 'id' })
  public servico?: EntidadeServico;
  
  @Column({ type: 'uuid' })
  public idMusico?: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (perfil: EntidadePerfil): EntidadeAvaliacao[] => perfil.avaliacoes,
  )
  @JoinColumn({ name: 'idMusico', referencedColumnName: 'id' })
  public musico?: EntidadePerfil;
}