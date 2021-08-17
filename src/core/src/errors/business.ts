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
  CONFLITO_HORARIO: 'Não é possível aceitar dois eventos que preencham o mesmo horário',
  DADOS_LOGIN_INVALIDOS: 'Dados de login inválidos',
  EVENTO_NAO_ENCONTRADO: 'Evento não encontrado',
  GENERO_MUSICAL_NAO_ENCONTRADO: 'Gênero musical não encontrado',
  LIMITE_CANCELAMENTO_ESTOURADO: 'Já passou o tempo limite para você cancelar esse serviço',
  PERFIL_NAO_ENCONTRADO: 'Perfil não encontrado',
  USUARIO_JA_CADASTRADO: 'Usuário já cadastrado',
  USUARIO_NAO_ENCONTRADO: 'Usuário não encontrado',
};