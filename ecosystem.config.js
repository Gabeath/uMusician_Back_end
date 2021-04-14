module.exports = {
  apps: [
    {
      script: 'dist/app/index.js',
      exec_mode: 'cluster',
      instances: 1,
      max_memory_restart: '512M',
      env: {},
      env_development: {
        DEBUG: 'true',
        NODE_ENV: 'development',
        SECRET_KEY: 'dW11c2ljaWFuX1NlY3JldF9wYXNz',
        API_PORT: '4546',
      },
    },
  ],
};