import {
  BaseHttpController,
  controller,
  httpGet,
  interfaces,
} from 'inversify-express-utils';
import { DateTime, Interval } from 'luxon';
import { Request } from 'express';
import { getEnv } from '@app/constants';

const startedAt: DateTime = DateTime.local();

@controller('/health')
export class HealthController extends BaseHttpController implements interfaces.Controller {
  startedAt: number;

  constructor( ) {
    super();

    this.startedAt = Date.now();
  }

  @httpGet('/status')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private searchDocument(req: Request): { app: string, uptime: number, now: string} {
    return {
      app: getEnv().appName,
      uptime: Interval.fromDateTimes(startedAt, DateTime.local()).length('seconds'),
      now: DateTime.local().toISO(),
    };
  }
}