export const envConfig = () => ({
  // APP
  env: process.env.NODE_ENV || 'development',
  host: process.env.APP_HOST || 'localhost',
  port: process.env.PORT || 3000,
  // DB
  dbHost: process.env.DB_HOST || 'mongodb',
  dbPort: process.env.DB_PORT || 27017,
  dbUsername: process.env.DB_USERNAME || 'mongoUser',
  dbPassword: process.env.DB_PASSWORD || 'mongoPass',
  dbDatabase: process.env.DB_DATABASE || 'training-app',
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
  jwtExpiration: process.env.JWT_EXPIRATION || '3600s',
  // LOGGING
  logLevel: process.env.LOG_LEVEL || 'info',
  // PAGINATION
  paginationDefaultLimit: process.env.PAGINATION_DEFAULT_LIMIT || 10,
  paginationMaxLimit: process.env.PAGINATION_MAX_LIMIT || 100,
});
