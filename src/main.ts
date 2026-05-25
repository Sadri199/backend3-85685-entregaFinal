import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Pokemon Adoption API')
    .setDescription(
      'An API designed so Trainers can Adopt Pokemons. For Education Purposes.',
    )
    .setVersion('1.0')
    .addTag('pokemon')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3080);
  console.log(`Listening at ${process.env.PORT}`);
}
bootstrap().catch(console.error);
