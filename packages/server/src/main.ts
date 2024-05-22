import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AddStatusCodeInterceptor } from "./utils/interceptors/AddStatusCodeInterceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe( {
    transform: true,
  } ));
  app.useGlobalInterceptors(new AddStatusCodeInterceptor());

  await app.listen(8080);
}
bootstrap();
