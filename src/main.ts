import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //вырезать поля которых нет в DТО
      forbidNonWhitelisted: true, // выбросить ошибку 400 на поля которых нет
      transform: true, // автоматически преобразует типы данных
      transformOptions: {enableImplicitConversion: true} // помощник в приведении типов '10' - 10,'true' - true
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
