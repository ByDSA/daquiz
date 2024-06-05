import { Module } from "@nestjs/common";
import { QuestionsAnswersController } from "../infrastructure/controllers";
import { QuestionTextAnswerModule } from "./answer-text/modules";
import { QuestionAnswerCheckingModule } from "./checking/modules";
import { QuestionsAnswersServiceModule } from "./service.module";

@Module( {
  imports: [
    QuestionsAnswersServiceModule,
    // Submodules
    QuestionTextAnswerModule,
    QuestionAnswerCheckingModule,
  ],
  controllers: [QuestionsAnswersController],
  providers: [
  ],
  exports: [
    QuestionsAnswersServiceModule,
    QuestionTextAnswerModule,
    QuestionAnswerCheckingModule,
  ],
} )
export class QuestionsAnswersModule {}
