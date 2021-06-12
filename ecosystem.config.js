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
        PORT: '4546',
        CLOUDINARY_CLOUD_NAME: 'umusician',
        CLOUDINARY_API_KEY: '455298595282338',
        CLOUDINARY_API_SECRET: '2Gmyor2gwoj1pXmMsYVxVqDKr70'
      },
    },
  ],
};