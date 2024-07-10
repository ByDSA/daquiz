import { Module } from "@nestjs/common";
import { QuestionAnswerCheckingModule } from "./app/checking";
import { QuestionAnswerModule } from "./infra";

@Module( {
  imports: [
    QuestionAnswerModule,
    // App Modules
    QuestionAnswerCheckingModule,
  ],
  controllers: [],
  providers: [
  ],
  exports: [
    QuestionAnswerCheckingModule,
  ],
} )
export class QuestionsAnswersModule {}
