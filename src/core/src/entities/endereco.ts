import {
  Column,
  Entity,
  JoinColumn,
  ObjectType,
  OneToOne,
} from 'typeorm';
import Base from './base';
import EntidadeEvento from './evento';

@Entity('endereco')
export default class EntidadeEndereco extends Base {
  @Column({ type: 'uuid' })
  public idEvento!: string;

  @OneToOne((): ObjectType<EntidadeEvento> => EntidadeEvento)
  @JoinColumn({ name : 'idEvento', referencedColumnName: 'id' })
  public evento?: EntidadeEvento;

  @Column()
  public cep: string;

  @Column()
  public pais: string;

  @Column()
  public estado: string;

  @Column()
  public cidade: string;

  @Column()
  public bairro: string;

  @Column()
  public rua: string;

  @Column()
  public numero: string;

  @Column()
  public complemento?: string;
}
