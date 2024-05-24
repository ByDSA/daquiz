import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AddStatusCodeInterceptor } from "./utils/interceptors/AddStatusCodeInterceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === "development") {
    app.enableCors( {
      origin: (origin, callback) => {
        if (!origin || origin.startsWith("http://localhost")) // Cualquier puerto
          callback(null, true);
        else
          callback(new Error("Not allowed by CORS"));
      },
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      credentials: true,
    } );
  }

  app.useGlobalPipes(new ValidationPipe( {
    transform: true,
  } ));
  app.useGlobalInterceptors(new AddStatusCodeInterceptor());

  await app.listen(8080);
}
bootstrap();
