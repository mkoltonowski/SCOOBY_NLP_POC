import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserProviders } from './user';
import { SeriesApplicationModule } from './series.application/series.application.module';

@Module({
  imports: [CqrsModule, SeriesApplicationModule],
  providers: [...UserProviders],
  exports: [...UserProviders, SeriesApplicationModule],
})
export class ApplicationModule {}
