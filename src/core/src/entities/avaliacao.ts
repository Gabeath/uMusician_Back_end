import {
  Column,
  Entity,
  JoinColumn,
  ObjectType,
  OneToOne,
} from 'typeorm';
import Base from './base';
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
}