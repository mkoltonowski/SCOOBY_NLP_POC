import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfgs: ConfigService) => ({
        ...cfgs.get<DataSourceOptions>('postgres'),
      }),
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatasourceModule {}
