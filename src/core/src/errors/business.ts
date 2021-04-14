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

export const ErrorCodes: Record<string, string> = {
  DADOS_LOGIN_INVALIDOS: 'dados_de_login_invalidos',
  ENTIDADE_NAO_ENCONTRADA: 'entidade_não_encontrada',
  PERFIL_NAO_ENCONTRADO: 'perfil_não_encontrado',
  USUARIO_JA_CADASTRADO: 'usuario_ja_cadastrado',
};