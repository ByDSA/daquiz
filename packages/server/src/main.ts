import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import { AppModule } from "./app.module";
import { AddStatusCodeInterceptor } from "./utils/interceptors/AddStatusCodeInterceptor";
import { CustomLogger } from "./utils/logging/CustomLogger";

async function bootstrap() {
  const customLoggerService = new CustomLogger();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger(customLoggerService.createLoggerConfig),

  } );

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
