import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import dbConfig from '../config/postgres';

ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfig],
});

export default new DataSource(dbConfig());
