import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserProviders } from './user';
import { DatasourceModule } from '../datasource/datasource.module';

@Module({
  imports: [DatasourceModule, CqrsModule],
  providers: [...UserProviders],
  exports: [...UserProviders],
})
export class ApplicationModule {}
