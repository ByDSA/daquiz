import { Module } from "@nestjs/common";
import { QuestionsController } from "./Questions.controller";
import { QuestionsService } from "./Questions.service";
import { QuestionsServicePort } from "./Questions.service.port";
import { QuestionsDBModule } from "./db";
import { CustomEventEmitterModule } from "#/events/module";

@Module( {
  imports: [
    QuestionsDBModule,
    CustomEventEmitterModule,
  ],
  controllers: [QuestionsController],
  providers: [{
    provide: QuestionsServicePort,
    useClass: QuestionsService,
  }],
  exports: [QuestionsDBModule, QuestionsServicePort],
} )
export class QuestionsModule {}
