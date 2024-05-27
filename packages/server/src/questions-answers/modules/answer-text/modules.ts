import { Module } from "@nestjs/common";
import { QuestionsAnswersDBModule } from "../../db/db.module";
import { QuestionsAnswersService } from "../../services";
import { QuestionTextAnswerController } from "./controllers";
import { QuestionTextAnswerService } from "./services";
import { QuestionsModule } from "#/questions/modules";
import { EventsModule } from "#/events/module";
import { TextAnswersModule } from "#/answers/text-answer/modules";

@Module( {
  imports: [
    TextAnswersModule,
    QuestionsAnswersDBModule,
    QuestionsModule,
    EventsModule,
  ],
  controllers: [QuestionTextAnswerController],
  providers: [
    QuestionTextAnswerService,
    QuestionsAnswersService,
  ],
} )
export class QuestionTextAnswerModule {}
