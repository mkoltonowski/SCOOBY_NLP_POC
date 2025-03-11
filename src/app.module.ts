import { Module } from '@nestjs/common';
import { DatasourceModule } from './app/datasource/datasource.module';
import { ConfigModule } from '@nestjs/config';
import postgres from './config/postgres';
import { InterfaceModule } from './app/interface/interface.module';
import { ApplicationModule } from './app/application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [postgres],
    }),
    DatasourceModule,
    InterfaceModule,
    ApplicationModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
