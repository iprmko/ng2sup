import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import * as cors from 'cors';
import * as morgan from 'morgan';
import * as compression from 'compression';

import { PagesRouter } from './routes/pagesRoute';
import { VariablesRouter }  from "./routes/variablesRoute";
import { ActionsRouter }  from "./routes/actionsRoute";
import { InfoRouter }  from "./routes/infoRoute";
// Creates and configures an ExpressJS web server.
class WebAPI {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.loadMiddlewares();
    this.setupEndpoints();
  }


  // Configure Express middleware.
  private loadMiddlewares(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.express.use(morgan("common"));
    this.express.use(cors({
      origin: ["http://localhost:8100"],
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }));
    this.express.use(compression());

  }

  // Configure API endpoints.
  private setupEndpoints(): void {
    let router = express.Router();

    router.use('/pages', PagesRouter);
    router.use('/variables', VariablesRouter);
    router.use('/actions', ActionsRouter);

    var infoRouter: express.RequestHandler = InfoRouter('', router);
    router.use('/', infoRouter);

    this.express.use('/api/v1/', router);

  }


}

export default new WebAPI().express;
