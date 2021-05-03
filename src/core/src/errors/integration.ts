import { CustomError } from 'ts-custom-error';

export default class IntegrationError extends CustomError {
  service: string;
  isIntegrationError = true;
  errorCode: string;

  constructor(service: string, err: any) {
    super(err);
    this.service = service;
    if (service === 'cloudinary') {
      if (err.message === 'Invalid image file') {
        this.message = 'Formato de imagem inválido';
      }
    } else {
      this.message = err.message as string;
    }
  }
}