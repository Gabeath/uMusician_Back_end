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
  ARGUMENTOS_AUSENTES: 'Argumentos ausentes',
  DADOS_LOGIN_INVALIDOS: 'Dados de login inválidos',
  PERFIL_NAO_ENCONTRADO: 'Perfil não encontrado',
  USUARIO_JA_CADASTRADO: 'Usuário já cadastrado',
  USUARIO_NAO_ENCONTRADO: 'Usuário não encontrado',
};