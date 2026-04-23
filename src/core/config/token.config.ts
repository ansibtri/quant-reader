import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
  TokenSecret: process.env.JWT_SECRET,
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES,
}));
