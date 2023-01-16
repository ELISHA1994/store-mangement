import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { APIPrefix } from './constant/constant';
import getLogLevels from './shared/utils/getLogLevels';
import CustomLogger from './logs/customLogger';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  const baseUrl: string = config.get<string>('BASE_URL');

  app.use(cookieParser());
  app.useLogger(app.get(CustomLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix(APIPrefix.Version);

  // enable DI for class-validator
  // this is an important step, for further steps in this article
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port, () => {
    console.log('[WEB]', baseUrl);
  });
}
bootstrap();
