import { Module } from '@nestjs/common';
import { DatasourceModule } from './datasource/datasource.module';

@Module({ imports: [DatasourceModule], exports: [DatasourceModule] })
export class InfrastructureModule {}
