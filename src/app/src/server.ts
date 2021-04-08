import '@app/controllers';
import * as bodyParser from 'body-parser';
import * as httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'inversify';
import { IRepositoryUsuario } from '@core/repositories/interfaces/usuario';
import { IServiceUsuario } from '@app/services/interfaces/usuario';
import { InversifyExpressServer } from 'inversify-express-utils';
import { RepositoryUsuario } from '@core/repositories/usuario';
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
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    } else if (err.isUnauthorizedError || err.name === 'TokenExpiredError') {
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
    container.bind<IServiceUsuario>(TYPES.ServiceUsuario)
      .to(ServiceUsuario);
    container.bind<IRepositoryUsuario>(TYPES.RepositoryUsuario)
      .to(RepositoryUsuario);
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
  