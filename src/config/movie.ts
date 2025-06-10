import { registerAs } from '@nestjs/config';

const createPostgresDbOptions = (
  env: Record<string, string>,
): { id: string; key: string } => ({
  id: env.API_SCOOBY_DOO_ID,
  key: env.EMBEDDING_KEY,
});

export default registerAs('movie', () => {
  const { env } = process;

  return createPostgresDbOptions(env);
});
