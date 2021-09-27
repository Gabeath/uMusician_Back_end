/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import '@app/controllers';
import * as bodyParser from 'body-parser';
import * as httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import BusinessError from '@core/errors/business';
import { Container } from 'inversify';
import ForbiddenError from '@core/errors/forbidden';
import { IRepositoryAdmin } from '@core/repositories/interfaces/administrador';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryApresentacaoGenero } from '@core/repositories/interfaces/apresentacao-genero';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { IRepositoryConfirmacaoPresenca } from '@core/repositories/interfaces/confirmacao-presenca';
import { IRepositoryEndereco } from '@core/repositories/interfaces/endereco';
import { IRepositoryEspecialidade } from '@core/repositories/interfaces/especialidade';
import { IRepositoryEspecialidadeServico } from '@core/repositories/interfaces/especialidade-servico';
import { IRepositoryEvento } from '@core/repositories/interfaces/evento';
import { IRepositoryGeneroMusical } from '@core/repositories/interfaces/genero-musical';
import { IRepositoryGeneroServico } from '@core/repositories/interfaces/genero-servico';
import { IRepositoryMidia } from '@core/repositories/interfaces/midia';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IRepositoryUsuario } from '@core/repositories/interfaces/usuario';
import { IServiceAvaliacao } from '@app/services/interfaces/avaliacao';
import { IServiceConfirmacaoPresenca } from '@app/services/interfaces/confirmacao-presenca';
import { IServiceEspecialidade } from '@app/services/interfaces/especialidade';
import { IServiceEvento } from '@app/services/interfaces/evento';
import { IServiceGeneroMusical } from '@app/services/interfaces/generoMusical';
import { IServiceMidia } from '@app/services/interfaces/midia';
import { IServicePerfil } from './services/interfaces/perfil';
import { IServiceServico } from './services/interfaces/servico';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import IntegrationError from '@core/errors/integration';
import { InversifyExpressServer } from 'inversify-express-utils';
import { RepositoryAdmin } from '@core/repositories/administrador';
import { RepositoryApresentacaoEspecialidade } from '@core/repositories/apresentacao-especialidade';
import { RepositoryApresentacaoGenero } from '@core/repositories/apresentacao-genero';
import { RepositoryAvaliacao } from '@core/repositories/avaliacao';
import { RepositoryConfirmacaoPresenca } from '@core/repositories/confirmacao-presenca';
import { RepositoryEndereco } from '@core/repositories/endereco';
import { RepositoryEspecialidade } from '@core/repositories/especialidade';
import { RepositoryEspecialidadeServico } from '@core/repositories/especialidade-servico';
import { RepositoryEvento } from '@core/repositories/evento';
import { RepositoryGeneroMusical } from '@core/repositories/genero-musical';
import { RepositoryGeneroServico } from '@core/repositories/genero-servico';
import { RepositoryMidia } from '@core/repositories/midia';
import { RepositoryPerfil } from '@core/repositories/perfil';
import { RepositoryServico } from '@core/repositories/servico';
import { RepositoryUsuario } from '@core/repositories/usuario';
import { ServiceAvaliacao } from '@app/services/avaliacao';
import { ServiceConfirmacaoPresenca } from '@app/services/confirmacao-presenca';
import { ServiceEspecialidade } from '@app/services/especialidade';
import { ServiceEvento } from '@app/services/evento';
import { ServiceGeneroMusical } from '@app/services/generoMusical';
import { ServiceMidia } from '@app/services/midia';
import { ServicePerfil } from './services/perfil';
import { ServiceServico } from './services/servico';
import { ServiceUsuario } from '@app/services/usuario';
import TYPES from '@core/types';
import UnauthorizedError from '@core/errors/unauthorized';
import compress from 'compression';
import cors from 'cors';
import { getEnv } from '@app/constants';
import helmet from 'helmet';
import updateServiceStatus from '@app/jobs/updateServiceStatusDaily';
import { v4 } from 'uuid';

const container: Container = new Container();

const handleError: (
  err: BusinessError | IntegrationError | ForbiddenError | UnauthorizedError | Error,
  req: Request,
  res: Response,
) => void =
(
  err: BusinessError | IntegrationError | ForbiddenError | UnauthorizedError,
  req: Request,
  res: Response,
): void => {
  if (err instanceof BusinessError && err.isBusinessError) {
    res.status(httpStatus.BAD_REQUEST).json({
      error: err.code,
      options: err.options,
    });

  } else if ((err instanceof UnauthorizedError && err.isUnauthorizedError) || err.name === 'TokenExpiredError') {
    res.sendStatus(httpStatus.UNAUTHORIZED);
  } else {
    if (getEnv().env !== 'production') {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ stack: err.stack, message: err.message, ...err });
    } else {
      res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
};

export class Server {

  constructor() {
    this.configDependencies();
    this.createServer();
  }

  configDependencies(): void {
    container.bind<IRepositoryAdmin>(TYPES.RepositoryAdmin)
      .to(RepositoryAdmin);

    container.bind<IRepositoryApresentacaoEspecialidade>(TYPES.RepositoryApresentacaoEspecialidade)
      .to(RepositoryApresentacaoEspecialidade);

    container.bind<IRepositoryApresentacaoGenero>(TYPES.RepositoryApresentacaoGenero)
      .to(RepositoryApresentacaoGenero);

    container.bind<IRepositoryAvaliacao>(TYPES.RepositoryAvaliacao)
      .to(RepositoryAvaliacao);
    container.bind<IServiceAvaliacao>(TYPES.ServiceAvaliacao)
      .to(ServiceAvaliacao);

    container.bind<IRepositoryConfirmacaoPresenca>(TYPES.RepositoryConfirmacaoPresenca)
      .to(RepositoryConfirmacaoPresenca);
    container.bind<IServiceConfirmacaoPresenca>(TYPES.ServiceConfirmacaoPresenca)
      .to(ServiceConfirmacaoPresenca);

    container.bind<IRepositoryEndereco>(TYPES.RepositoryEndereco)
      .to(RepositoryEndereco);

    container.bind<IRepositoryEspecialidade>(TYPES.RepositoryEspecialidade)
      .to(RepositoryEspecialidade);
    container.bind<IServiceEspecialidade>(TYPES.ServiceEspecialidade)
      .to(ServiceEspecialidade);

    container.bind<IRepositoryEspecialidadeServico>(TYPES.RepositoryEspecialidadeServico)
      .to(RepositoryEspecialidadeServico);

    container.bind<IRepositoryEvento>(TYPES.RepositoryEvento)
      .to(RepositoryEvento);
    container.bind<IServiceEvento>(TYPES.ServiceEvento)
      .to(ServiceEvento);

    container.bind<IRepositoryGeneroMusical>(TYPES.RepositoryGeneroMusical)
      .to(RepositoryGeneroMusical);
    container.bind<IServiceGeneroMusical>(TYPES.ServiceGeneroMusical)
      .to(ServiceGeneroMusical);

    container.bind<IRepositoryGeneroServico>(TYPES.RepositoryGeneroServico)
      .to(RepositoryGeneroServico);

    container.bind<IRepositoryMidia>(TYPES.RepositoryMidia)
      .to(RepositoryMidia);
    container.bind<IServiceMidia>(TYPES.ServiceMidia)
      .to(ServiceMidia);

    container.bind<IRepositoryPerfil>(TYPES.RepositoryPerfil)
      .to(RepositoryPerfil);
    container.bind<IServicePerfil>(TYPES.ServicePerfil)
      .to(ServicePerfil);

    container.bind<IRepositoryServico>(TYPES.RepositoryServico)
      .to(RepositoryServico);
    container.bind<IServiceServico>(TYPES.ServiceServico)
      .to(ServiceServico);
        
    container.bind<IRepositoryUsuario>(TYPES.RepositoryUsuario)
      .to(RepositoryUsuario);
    container.bind<IServiceUsuario>(TYPES.ServiceUsuario)
      .to(ServiceUsuario);
  }

  createServer(): void {
    const server: InversifyExpressServer = new InversifyExpressServer(container);
    // tslint:disable-next-line: no-shadowed-variable
    server.setConfig((app: any): void => {
      // add body parser
      app.use(bodyParser.urlencoded({
        extended: true,
      }));
      app.use(bodyParser.json());

      app.use(compress());

      // secure apps by setting various HTTP headers
      app.use(helmet());

      // enable CORS - Cross Origin Resource Sharing
      app.use(cors());

      app.use((req: Request, res: Response, next: NextFunction): void => {
        req.headers['X-Request-ID'] = v4();
        next();
      });
    });

    // tslint:disable-next-line: no-shadowed-variable
    server.setErrorConfig((app: any): void => {
      // catch 404 and forward to error handler
      app.use((_req: Request, res: Response): void => {
        res.status(httpStatus.NOT_FOUND).json();
      });
      // Handle 500
      // do not remove next from line bellow, error handle will not work
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      app.use((err: any, req: Request, res: Response, _next: NextFunction): void =>
        handleError(err, req, res));
    });

    const app: any = server.build();
    updateServiceStatus.start();
    app.listen(getEnv().port, (): void => console.log(`ONLINE ${getEnv().port}`));
  }

}
  