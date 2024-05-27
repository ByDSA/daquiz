import { Module } from "@nestjs/common";
import { QuestionsAnswersServiceModule } from "../service.module";
import { QuestionAnswerCheckingController } from "./controllers";
import { QuestionAnswerCheckingService } from "./services";
import { QuestionsModule } from "#/questions/modules";
import { TextAnswersModule } from "#/answers/text-answer/modules";

@Module( {
  imports: [
    QuestionsAnswersServiceModule,
    QuestionsModule,
    TextAnswersModule,
  ],
  controllers: [QuestionAnswerCheckingController],
  providers: [
    QuestionAnswerCheckingService,
  ],
} )
export class QuestionAnswerCheckingModule {}
