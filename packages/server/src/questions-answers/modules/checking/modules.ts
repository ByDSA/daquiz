import { Module } from "@nestjs/common";
import { QuestionAnswerCheckingController } from "./controllers";
import { QuestionAnswerCheckingService } from "./services";
import { TextAnswersModule } from "#/answers/text-answer/modules";
import { QuestionsAnswersDBModule } from "#/questions-answers/db/db.module";
import { QuestionsAnswersService } from "#/questions-answers/services";
import { QuestionsModule } from "#/questions/modules";

@Module( {
  imports: [
    QuestionsAnswersDBModule,
    QuestionsModule,
    TextAnswersModule,
  ],
  controllers: [QuestionAnswerCheckingController],
  providers: [
    QuestionsAnswersService,
    QuestionAnswerCheckingService,
  ],
} )
export class QuestionAnswerCheckingModule {}
