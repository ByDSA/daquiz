import { Module } from "@nestjs/common";
import { QuestionAnswerCheckingModule } from "./app/checking";
import { QuestionAnswerModule, QuestionTextAnswerModule } from "./infra";

@Module( {
  imports: [
    QuestionAnswerModule,
    QuestionTextAnswerModule,
    // App Modules
    QuestionAnswerCheckingModule,
  ],
  controllers: [],
  providers: [
  ],
  exports: [
    QuestionTextAnswerModule,
    QuestionAnswerCheckingModule,
  ],
} )
export class QuestionsAnswersModule {}
