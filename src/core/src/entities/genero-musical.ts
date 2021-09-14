import {
  Column,
  Entity,
  ObjectType,
  OneToMany,
} from 'typeorm';
import Base from './base';
import EntidadeApresentacaoGenero from './apresentacao-genero';

@Entity('genero-musical')
export default class EntidadeGeneroMusical extends Base {
  @Column()
  public nome!: string;

  @Column({ type: 'int4' })
  public popularidade!: number;

  @Column()
  public iconeUrl?: string;

  @OneToMany(
    (): ObjectType<EntidadeApresentacaoGenero> => EntidadeApresentacaoGenero,
    (apresentacaoGenero: EntidadeApresentacaoGenero): EntidadeGeneroMusical =>
      apresentacaoGenero.generoMusical,
  )
  apresentacoesGenero?: EntidadeApresentacaoGenero[];
}