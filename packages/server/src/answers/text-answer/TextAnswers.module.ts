import { Module } from "@nestjs/common";
import { TextAnswersController } from "./TextAnswers.controller";
import { TextAnswersService } from "./TextAnswers.service";
import { TextAnswersServicePort } from "./TextAnswers.service.port";
import { TextAnswersDBModule } from "./db";
import { EventsModule } from "#/events/module";

@Module( {
  imports: [
    TextAnswersDBModule,
    EventsModule,
  ],
  controllers: [TextAnswersController],
  providers: [{
    provide: TextAnswersServicePort,
    useClass: TextAnswersService,
  }],
  exports: [TextAnswersDBModule, TextAnswersServicePort],
} )
export class TextAnswersModule {}
