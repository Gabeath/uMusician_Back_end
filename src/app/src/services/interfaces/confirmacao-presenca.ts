import EntidadeConfirmacaoPresenca from '@core/entities/confirmacao-presenca';

export interface IServiceConfirmacaoPresenca {
  gerarCodigoConfirmacao(idServico: string, idContratante: string): Promise<EntidadeConfirmacaoPresenca>;
}