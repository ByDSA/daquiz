import { Module } from "@nestjs/common";
import { QuestionAnswerCheckingController } from "./controllers";
import { QuestionAnswerCheckingService } from "./services";
import { TextAnswersModule } from "#/answers/text-answer/modules";
import { QuestionsAnswersDBModule } from "#/questions-answers/db/db.module";
import { QuestionsAnswersService } from "#/questions-answers/services";
import { TextQuestionsModule } from "#/questions/text-question/modules";

@Module( {
  imports: [
    QuestionsAnswersDBModule,
    TextQuestionsModule,
    TextAnswersModule,
  ],
  controllers: [QuestionAnswerCheckingController],
  providers: [
    QuestionsAnswersService,
    QuestionAnswerCheckingService,
  ],
} )
export class QuestionAnswerCheckingModule {}
