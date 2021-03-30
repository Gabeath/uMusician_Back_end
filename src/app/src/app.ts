import { initializeEnv } from '@app/constants';

(async () => {
  initializeEnv({
    ...process.env,
  });

  const { initializeCore } = require('@core/app');
  await initializeCore();

  const { Server } = require('@app/server');
  new Server();
})().catch((err) => console.error(err));
