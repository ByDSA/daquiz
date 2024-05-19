import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AddStatusCodeInterceptor } from "./utils/interceptors/AddStatusCodeInterceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new AddStatusCodeInterceptor());

  await app.listen(8080);
}
bootstrap();
