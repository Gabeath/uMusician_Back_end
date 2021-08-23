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
import EntidadeAvaliacao from './avaliacao';
import EntidadeConfirmacaoPresenca from './confirmacao-presenca';
import EntidadeEspecialidadeServico from './especialidade-servico';
import EntidadeEvento from './evento';
import EntidadeGeneroServico from './genero-servico';
import EntidadePerfil from './perfil';

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

  @OneToMany(
    (): ObjectType<EntidadeGeneroServico> => EntidadeGeneroServico,
    (generoServico: EntidadeGeneroServico): EntidadeServico =>
      generoServico.servico,
  )
  generosServico?: EntidadeGeneroServico[];

  @OneToMany(
    (): ObjectType<EntidadeEspecialidadeServico> => EntidadeEspecialidadeServico,
    (especialidadeServico: EntidadeEspecialidadeServico): EntidadeServico =>
      especialidadeServico.servico,
  )
  especialidadesServico?: EntidadeEspecialidadeServico[];

  @OneToMany(
    (): ObjectType<EntidadeConfirmacaoPresenca> => EntidadeConfirmacaoPresenca,
    (confirmacaoPresenca: EntidadeConfirmacaoPresenca): EntidadeServico => confirmacaoPresenca.servico,
  )
  confirmacoesPresenca?: EntidadeConfirmacaoPresenca[];

  musico?: EntidadePerfil;
}