import { Module } from "@nestjs/common";
import { QuestionTextAnswerModule } from "./app/answer-text/module";
import { QuestionAnswerCheckingModule } from "./app/checking";
import { QuestionAnswerDBModule } from "./infra";
import { QuestionsAnswersController } from "./infra/controller";

@Module( {
  imports: [
    QuestionAnswerDBModule,
    // App Modules
    QuestionTextAnswerModule,
    QuestionAnswerCheckingModule,
  ],
  controllers: [QuestionsAnswersController],
  providers: [
  ],
  exports: [
    QuestionTextAnswerModule,
    QuestionAnswerCheckingModule,
  ],
} )
export class QuestionsAnswersModule {}
