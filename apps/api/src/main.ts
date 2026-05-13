import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  app.use(
    json({
      verify: (req: any, _res: any, buffer: Buffer) => {
        req.rawBody = Buffer.from(buffer);
      },
    }),
  );
  app.use(
    urlencoded({
      extended: true,
      verify: (req: any, _res: any, buffer: Buffer) => {
        req.rawBody = Buffer.from(buffer);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
