import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { UserModule } from './components/user/user.module';
import { AuthModule } from './components/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GoogleModule } from './components/google/google.module';
import { StoreModule } from './components/store/store.module';
import { GeneralExceptionFilter } from './shared/filters';
import { StandardResponseInterceptor } from './shared/interceptors';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { LoggerModule } from './logs/logger.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: envFilePath, isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    GoogleModule,
    StoreModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
