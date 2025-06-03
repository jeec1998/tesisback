import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001']||['https://tutoria-e3bbf2e4gtefafhz.eastus2-01.azurewebsites.net/'];
  app.enableCors({
    origin: cors, 
    credentials: true
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
