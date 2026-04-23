import { registerAs } from '@nestjs/config';

export default registerAs('posthog', () => ({
  apiKey: process.env.POSTHOG_PROJECT_TOKEN,
  host: process.env.POSTHOG_HOST,
}));
