import EntidadeConfirmacaoPresenca from '@core/entities/confirmacao-presenca';

export interface IServiceConfirmacaoPresenca {
  gerarCodigoConfirmacao(idServico: string, idMusico: string): Promise<EntidadeConfirmacaoPresenca>;
  confirmarPresenca(idServico: string, codigo: string, idContratante: string): Promise<void>;
}