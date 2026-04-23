import { plainToInstance } from 'class-transformer';
import { IsEnum, validateSync } from 'class-validator';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

enum Environment {
  Development = 'DEVELOPMENT',
  Production = 'PRODUCTION',
  Test = 'TEST',
}
export class EnvironmentVariables {
  @IsOptional()
  @IsString()
  APP_NAME!: string;

  @IsOptional()
  @IsString()
  APP_VERSION!: string;

  @IsNumber()
  @Type(() => Number)
  APP_PORT!: number;

  @IsEnum(Environment)
  NODE_ENV?: Environment;

  @IsString()
  DATABASE!: string;

  @IsString()
  DB_HOST!: string;

  @IsString()
  DB_USERNAME!: string;

  @IsString()
  DB_PASSWORD!: string;

  @IsNumber()
  @Type(() => Number)
  DB_PORT!: number;

  @IsString()
  POSTHOG_PROJECT_TOKEN!: string;

  @IsString()
  POSTHOG_HOST!: string;

  @IsString()
  MAIL_HOST!: string;

  @IsString()
  MAIL_PORT!: string;

  @IsString()
  MAIL_USERNAME!: string;

  @IsString()
  MAIL_PASS!: string;

  @IsString()
  FRONTEND_URL!: string;

  @IsString()
  FRONTEND_RECOVERY_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_ACCESS_EXPIRES!: string;

  @IsString()
  JWT_REFRESH_EXPIRES!: string;
}

export function validate(config: Record<string, unknown>) {
  const filteredConfig = {
    APP_NAME: config.APP_NAME,
    APP_VERSION: config.APP_VERSION,
    APP_PORT: config.APP_PORT,
    NODE_ENV: config.NODE_ENV,
    DATABASE: config.DATABASE,
    DB_HOST: config.DB_HOST,
    DB_USERNAME: config.DB_USERNAME,
    DB_PASSWORD: config.DB_PASSWORD,
    DB_PORT: config.DB_PORT,
    POSTHOG_PROJECT_TOKEN: config.POSTHOG_PROJECT_TOKEN,
    POSTHOG_HOST: config.POSTHOG_HOST,
    MAIL_HOST: config.MAIL_HOST,
    MAIL_PORT: config.MAIL_PORT,
    MAIL_USERNAME: config.MAIL_USERNAME,
    MAIL_PASS: config.MAIL_PASS,
    FRONTEND_URL: config.FRONTEND_URL,
    FRONTEND_RECOVERY_URL: config.FRONTEND_RECOVERY_URL,
    JWT_SECRET: config.JWT_SECRET,
    JWT_ACCESS_EXPIRES: config.JWT_ACCESS_EXPIRES,
    JWT_REFRESH_EXPIRES: config.JWT_REFRESH_EXPIRES,
  };

  // Only pick variables defined in EnvironmentVariables
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    filteredConfig,
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('; ');

    throw new Error(`Environment validation failed: ${messages}`);
  }

  return validatedConfig;
}
