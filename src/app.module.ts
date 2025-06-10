import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import postgres from './config/postgres';
import { InterfaceModule } from './app/interface/interface.module';
import { ApplicationModule } from './app/application/application.module';
import movie from './config/movie';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [postgres, movie],
    }),
    InterfaceModule,
    ApplicationModule,
    // InfrastructureModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
