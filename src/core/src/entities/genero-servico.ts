import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
} from 'typeorm';
import Base from './base';
import EntidadeApresentacaoGenero from './apresentacao-genero';
import EntidadeServico from './servico';

@Entity('genero-servico')
export default class EntidadeGeneroServico extends Base {
  @Column({ type: 'uuid' })
  public idServico!: string;

  @ManyToOne(
    (): ObjectType<EntidadeServico> => EntidadeServico,
    (servico: EntidadeServico): EntidadeGeneroServico[] => servico.generosServico,
  )
  @JoinColumn({ name: 'idServico', referencedColumnName: 'id' })
  servico?: EntidadeServico;

  @Column({ type: 'uuid' })
  public idApresentacaoGenero!: string;

  @ManyToOne(
    (): ObjectType<EntidadeApresentacaoGenero> => EntidadeApresentacaoGenero,
    (apresentacaoGenero: EntidadeApresentacaoGenero): EntidadeGeneroServico[] =>
      apresentacaoGenero.generosServico,
  )
  @JoinColumn({ name: 'idApresentacaoGenero', referencedColumnName: 'id' })
  apresentacaoGenero?: EntidadeApresentacaoGenero;
}