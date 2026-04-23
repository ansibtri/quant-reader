import { registerAs } from '@nestjs/config';

export default registerAs('frontend', () => ({
  url: process.env.FRONTEND_URL,
  recoveryUrl: process.env.FRONTEND_RECOVERY_URL,
}));
