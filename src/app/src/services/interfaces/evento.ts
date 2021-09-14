import EntidadeEvento from '@core/entities/evento';
import { SituaçãoServiço } from '@core/models/enumerators';

export interface IServiceEvento {
  create(idContratante: string, servico: EntidadeEvento): Promise<EntidadeEvento>;
  getEventosByIdContratante(idContratante: string, situacoesDosServicos: SituaçãoServiço[]): Promise<EntidadeEvento[]>;
  getDetalhesEvento(id: string): Promise<EntidadeEvento>;
}