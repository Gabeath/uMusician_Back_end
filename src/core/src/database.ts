import { createConnection } from 'typeorm';
import * as path from 'path';

import { getEnv, Constants } from '@core/constants';

const ConstantsEnv: Constants = getEnv();

export async function initializeDatabase(): Promise<void> {

  await createConnection({
    type: 'postgres',

    uuidExtension: 'uuid-ossp',

    host: ConstantsEnv.database.hostWrite,
    username: ConstantsEnv.database.user,
    password: ConstantsEnv.database.password,
    database: ConstantsEnv.database.name,

    migrations: [`${path.join(__dirname, 'migrations/*{.ts,.js}')}`],
    entities: [`${path.join(__dirname, 'entities/*{.ts,.js}')}`],

    migrationsRun: true,
  });
};