import { Container } from 'inversify';
import * as bodyParser from 'body-parser';
import * as httpStatus from 'http-status';
import cors from 'cors';
import compress from 'compression';
import helmet from 'helmet';
import { v4 } from 'uuid';
import { InversifyExpressServer } from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';
import '@app/controllers';
import { getEnv } from '@app/constants';

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
      // para depois fazer o bind dos services e repositories
      // container.bind<IUserService>(TYPES.UserService)
      //   .to(UserService);
      // container.bind<IUserRepository>(TYPES.UserRepository)
      //   .to(UserRepository);
      console.log('...');
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
  