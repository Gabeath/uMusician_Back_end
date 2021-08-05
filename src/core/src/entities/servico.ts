import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
  OneToOne,
} from 'typeorm';

import Base from './base';
import EntidadeAvaliacao from './avaliacao';
import EntidadeEvento from './evento';

@Entity('servico')
export default class EntidadeServico extends Base {
  @Column({ type: 'int4' })
  public situacao!: number;

  @Column({ type: 'float' })
  public valor!: number;

  @Column({ type: 'uuid' })
  public idEvento!: string;

  @OneToOne(
    (): ObjectType<EntidadeAvaliacao> => EntidadeAvaliacao,
    (avaliacao: EntidadeAvaliacao): EntidadeServico => avaliacao.servico,
  )
  avaliacao?: EntidadeAvaliacao;

  @ManyToOne(
    (): ObjectType<EntidadeEvento> => EntidadeEvento,
    (evento: EntidadeEvento): EntidadeServico[] => evento.servicos,
  )
  @JoinColumn({ name: 'idEvento', referencedColumnName: 'id' })
  public evento?: EntidadeEvento;
}