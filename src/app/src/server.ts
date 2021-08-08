/* eslint-disable */
import '@app/controllers';
import * as bodyParser from 'body-parser';
import * as httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'inversify';
import { IRepositoryApresentacaoEspecialidade } from '@core/repositories/interfaces/apresentacao-especialidade';
import { IRepositoryAvaliacao } from '@core/repositories/interfaces/avaliacao';
import { IRepositoryEndereco } from '@core/repositories/interfaces/endereco';
import { IRepositoryEspecialidade } from '@core/repositories/interfaces/especialidade';
import { IRepositoryGeneroMusical } from '@core/repositories/interfaces/genero-musical';
import { IRepositoryApresentacaoGenero } from '@core/repositories/interfaces/apresentacao-genero';
import { IRepositoryMidia } from '@core/repositories/interfaces/midia';
import { IRepositoryPerfil } from '@core/repositories/interfaces/perfil';
import { IRepositoryServico } from '@core/repositories/interfaces/servico';
import { IRepositoryUsuario } from '@core/repositories/interfaces/usuario';
import { IServiceAvaliacao } from '@app/services/interfaces/avaliacao';
import { IServiceEspecialidade } from '@app/services/interfaces/especialidade';
import { IServiceGeneroMusical } from '@app/services/interfaces/generoMusical';
import { IServiceMidia } from '@app/services/interfaces/midia';
import { IServicePerfil } from './services/interfaces/perfil';
import { IServiceServico } from './services/interfaces/servico';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import { InversifyExpressServer } from 'inversify-express-utils';
import { RepositoryApresentacaoEspecialidade } from '@core/repositories/apresentacao-especialidade';
import { RepositoryAvaliacao } from '@core/repositories/avaliacao';
import { RepositoryEndereco } from '@core/repositories/endereco';
import { RepositoryEspecialidade } from '@core/repositories/especialidade';
import { RepositoryGeneroMusical } from '@core/repositories/genero-musical';
import { RepositoryApresentacaoGenero } from '@core/repositories/apresentacao-genero';
import { RepositoryMidia } from '@core/repositories/midia';
import { RepositoryPerfil } from '@core/repositories/perfil';
import { RepositoryServico } from '@core/repositories/servico';
import { RepositoryUsuario } from '@core/repositories/usuario';
import { ServiceAvaliacao } from '@app/services/avaliacao';
import { ServiceEspecialidade } from '@app/services/especialidade';
import { ServiceGeneroMusical } from '@app/services/generoMusical';
import { ServiceMidia } from '@app/services/midia';
import { ServicePerfil } from './services/perfil';
import { ServiceServico } from './services/servico';
import { ServiceUsuario } from '@app/services/usuario';
import TYPES from '@core/types';
import compress from 'compression';
import cors from 'cors';
import { getEnv } from '@app/constants';
import helmet from 'helmet';
import { v4 } from 'uuid';

const container: Container = new Container();

const handleError: (err: any, req: Request, res: Response) => void =
  (err: any, req: Request, res: Response): void => {
    if (err.isBusinessError) {
      res.status(httpStatus.BAD_REQUEST).json({
        error: err.code,
        options: err.options,
      });

    } else if (err.isIntegrationError) {
      res.status(httpStatus.BAD_REQUEST).json({ error: err.message, service: err.service });
    } else if (err.isPersistentError) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ stack: err.stack, message: err.message, ...err });
    } else if (err.isUnauthorizedError || err.name === 'TokenExpiredError') {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (err.isForbiddenError) {
      res.sendStatus(httpStatus.FORBIDDEN);
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ stack: err.stack, message: err.message, ...err });
    }
  };

export class Server {

  constructor() {
    this.configDependencies();
    this.createServer();
  }

  configDependencies(): void {
    container.bind<IRepositoryApresentacaoEspecialidade>(TYPES.RepositoryApresentacaoEspecialidade)
      .to(RepositoryApresentacaoEspecialidade);

    container.bind<IRepositoryAvaliacao>(TYPES.RepositoryAvaliacao)
      .to(RepositoryAvaliacao);
    container.bind<IServiceAvaliacao>(TYPES.ServiceAvaliacao)
      .to(ServiceAvaliacao);

    container.bind<IRepositoryEndereco>(TYPES.RepositoryEndereco)
      .to(RepositoryEndereco);

    container.bind<IRepositoryEspecialidade>(TYPES.RepositoryEspecialidade)
      .to(RepositoryEspecialidade);
    container.bind<IServiceEspecialidade>(TYPES.ServiceEspecialidade)
      .to(ServiceEspecialidade);

    container.bind<IRepositoryGeneroMusical>(TYPES.RepositoryGeneroMusical)
      .to(RepositoryGeneroMusical);
    container.bind<IServiceGeneroMusical>(TYPES.ServiceGeneroMusical)
      .to(ServiceGeneroMusical);

    container.bind<IRepositoryApresentacaoGenero>(TYPES.RepositoryApresentacaoGenero)
      .to(RepositoryApresentacaoGenero);

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
      app.use((err: any, req: Request, res: Response, _next: NextFunction): void =>
        handleError(err, req, res));
    });

    const app: any = server.build();
    app.listen(getEnv().port, (): void => console.log(`ONLINE ${getEnv().port}`));

  }

}
  