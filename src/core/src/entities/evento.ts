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
import EntidadeEndereco from './endereco';
import EntidadePerfil from './perfil';
import EntidadeServico from './servico';

@Entity('evento')
export default class EntidadeEvento extends Base {
  @Column()
  public nome!: string;
  
  @Column({ type: 'timestamptz' })
  public dataInicio!: string;
  
  @Column({ type: 'timestamptz' })
  public dataTermino!: string;

  @Column({ type: 'uuid' })
  public idContratante!: string;

  @ManyToOne(
    (): ObjectType<EntidadePerfil> => EntidadePerfil,
    (contratante: EntidadePerfil): EntidadeEvento[] => contratante.eventos,
  )
  @JoinColumn({ name: 'idContratante', referencedColumnName: 'id' })
  public contratante?: EntidadePerfil;

  @OneToOne(
    (): ObjectType<EntidadeEndereco> => EntidadeEndereco,
    (endereco: EntidadeEndereco): EntidadeEvento => endereco.evento,
  )
  endereco?: EntidadeEndereco;

  @OneToMany(
    (): ObjectType<EntidadeServico> => EntidadeServico,
    (servico: EntidadeServico): EntidadeEvento => servico.evento,
  )
  servicos?: EntidadeServico[];
}