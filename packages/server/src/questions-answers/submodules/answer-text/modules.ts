import { Module } from "@nestjs/common";
import { QuestionsAnswersServiceModule } from "../service.module";
import { QuestionTextAnswerService } from "./QuestionTextAnswer.service";
import { QuestionTextAnswerServicePort } from "./QuestionTextAnswer.service.port";
import { QuestionTextAnswerController } from "./controllers";
import { CustomEventEmitterModule } from "#/events/module";

@Module( {
  imports: [
    QuestionsAnswersServiceModule,
    CustomEventEmitterModule,
  ],
  controllers: [QuestionTextAnswerController],
  providers: [
    {
      provide: QuestionTextAnswerServicePort,
      useClass: QuestionTextAnswerService,
    },
  ],
} )
export class QuestionTextAnswerModule {}
