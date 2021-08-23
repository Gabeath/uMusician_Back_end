import EntidadeConfirmacaoPresenca from '@core/entities/confirmacao-presenca';

export interface IServiceConfirmacaoPresenca {
  gerarCodigoConfirmacao(idServico: string, idContratante: string): Promise<EntidadeConfirmacaoPresenca>;
  confirmarPresenca(idServico: string, codigo: string, idMusico: string): Promise<void>;
}