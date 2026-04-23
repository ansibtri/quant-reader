import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerApiDocs } from './common/swagger/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.log('Validation errors: ', JSON.stringify(errors, null, 2));
        return new BadRequestException(errors);
      },
    }),
  );

  const port = process.env.APP_PORT || 5000;
  // create api docs using swagger
  new SwaggerApiDocs(app).buildDocument();

  await app.listen(port);
  console.log('App is running at ' + (await app.getUrl()));
  console.log(
    'Documentation is available at ' + (await app.getUrl()) + '/docs',
  );
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
