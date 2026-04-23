import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'QUANT READER',
  version: process.env.APP_VERSION || 'v1.0',
  port: process.env.APP_PORT || '3000',
  env: process.env.NODE_ENV || 'DEVELOPMENT',
}));
