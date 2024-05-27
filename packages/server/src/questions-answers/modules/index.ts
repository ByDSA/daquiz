import { Module } from "@nestjs/common";
import { QuestionsAnswersController } from "../controllers";
import { QuestionsAnswersDBModule } from "../db/db.module";
import { QuestionsAnswersService } from "../services";
import { QuestionTextAnswerModule } from "./answer-text/modules";
import { QuestionAnswerCheckingModule } from "./checking/modules";
import { QuestionsModule } from "#/questions/modules";
import { EventsModule } from "#/events/module";
import { TextAnswersModule } from "#/answers/text-answer/modules";

@Module( {
  imports: [
    QuestionsAnswersDBModule,
    QuestionsModule,
    TextAnswersModule,
    EventsModule,
    // Submodules
    QuestionTextAnswerModule,
    QuestionAnswerCheckingModule,
  ],
  controllers: [QuestionsAnswersController],
  providers: [
    QuestionsAnswersService,
  ],
  exports: [
    QuestionsAnswersService,
  ],
} )
export class QuestionsAnswersModule {}
