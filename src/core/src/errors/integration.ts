import { CustomError } from 'ts-custom-error';

export default class IntegrationError extends CustomError {
  service: string;
  isIntegrationError = true;
  errorCode: string;

  constructor(service: string, err: any) {
    super(err);
    this.service = service;
    
    if (err.message === 'Invalid image file') {
      this.message = 'Formato de imagem não suportado';
    } else if (err.message === 'Input file contains unsupported image format') {
      this.message = 'Formato de imagem não suportado';
    } else {
      this.message = err.message as string;
    }
    
  }
}