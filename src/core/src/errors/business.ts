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
  CONTA_JA_CRIADA: 'conta_ja_criada',
  ENTIDADE_NAO_ENCONTRADA: 'entidade_não_encontrada',
};