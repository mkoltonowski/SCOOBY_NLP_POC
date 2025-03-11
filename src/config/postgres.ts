import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

const createPostgresDbOptions = (
  env: Record<string, string>,
): DataSourceOptions => ({
  type: 'postgres',
  database: env.DB_DATABASE_NAME,
  host: env.DB_HOST,
  port: +env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  entities: [`${__dirname}/../**/*.entity.{js,ts}`],
  migrations: [`${__dirname}/../**/migrations/*.{js,ts}`],
  migrationsRun: true,
  synchronize: false,
});

export default registerAs('postgres', () => {
  const { env } = process;

  return createPostgresDbOptions(env);
});
