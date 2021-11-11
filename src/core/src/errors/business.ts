import { CustomError } from 'ts-custom-error';

export default class BusinessError extends CustomError {
  code: string;
  options: { [key: string]: string | number | boolean };
  isBusinessError = true;

  constructor(code: string, options?: { [key: string]: string | number | boolean }) {
    super(code);
    this.code = code;
    this.options = options;
  }
}

export const ErrorCodes = {
  APRESENTACAO_NAO_ENCONTRADA: 'Apresentação não encontrada',
  ARGUMENTOS_AUSENTES: 'Argumentos ausentes',
  ARGUMENTOS_INVALIDOS: 'Argumentos inválidos',
  CODIGO_INVALIDO: 'Código inválido',
  CONFLITO_HORARIO: 'Não é possível aceitar dois eventos que preencham o mesmo horário',
  DADOS_LOGIN_INVALIDOS: 'Dados de login inválidos',
  ESPECIALIDADE_JA_CADASTRADA: 'Especialidade já cadastrada',
  ESPECIALIDADE_NAO_ENCONTRADA: 'Especialidade não encontrada',
  EVENTO_NAO_ENCONTRADO: 'Evento não encontrado',
  EVENTO_NAO_INICIADO: 'O evento deste serviço ainda não foi iniciado',
  GENERO_MUSICAL_JA_CADASTRADO: 'Gênero musical já cadastrado',
  GENERO_MUSICAL_NAO_ENCONTRADO: 'Gênero musical não encontrado',
  LIMITE_CANCELAMENTO_ESTOURADO: 'Já passou o tempo limite para você cancelar esse serviço',
  PERFIL_NAO_ENCONTRADO: 'Perfil não encontrado',
  SERVICO_JA_AVALIADO: 'Serviço já avaliado',
  SERVICO_NAO_ENCONTRADO: 'Serviço não encontrado',
  SERVICO_SEM_CONFIRMACAO_CRIADA: 'O músico deste serviço ainda não gerou sua confirmação',
  USUARIO_JA_CADASTRADO: 'Usuário já cadastrado',
  USUARIO_NAO_ENCONTRADO: 'Usuário não encontrado',
  MIDIA_NAO_ENCONTRADA: 'Mídia não encontrada',
  SOLICITACAO_NAO_ENCONTRADA: 'Solicitação não encontrada',
  SOLICITACAO_NAO_PENDENTE: 'A solicitação informada não está pendente de aceite ou recusa',
  SOLICITACAO_GENERO_INVALIDA: 'O tipo da solicitação informada não corresponde a um gênero musical',
  SOLICITACAO_ESPECIALIDADE_INVALIDA: 'O tipo da solicitação informada não corresponde a uma especialidade'
};