import { Module } from "@nestjs/common";
import { QuestionsAnswersServiceModule } from "../service.module";
import { QuestionTextAnswerController } from "./controllers";
import { QuestionTextAnswerService } from "./services";
import { EventsModule } from "#/events/module";

@Module( {
  imports: [
    QuestionsAnswersServiceModule,
    EventsModule,
  ],
  controllers: [QuestionTextAnswerController],
  providers: [
    QuestionTextAnswerService,
  ],
} )
export class QuestionTextAnswerModule {}
