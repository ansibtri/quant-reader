export interface AppConfig {
  name: string;
  version: string;
  port: number;
  env: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
}

export interface MailConfig {
  host: string;
  port: number;
  username: string;
  pass: string;
}
