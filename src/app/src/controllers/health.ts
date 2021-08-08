import {
  BaseHttpController,
  controller,
  httpGet,
  interfaces,
} from 'inversify-express-utils';
import { DateTime, Interval } from 'luxon';
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
  private searchDocument(): { app: string, uptime: number, now: string } {
    return {
      app: getEnv().appName,
      uptime: Interval.fromDateTimes(startedAt, DateTime.local()).length('seconds'),
      now: DateTime.local().toISO(),
    };
  }
}