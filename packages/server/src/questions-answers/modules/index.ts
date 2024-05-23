import { Module } from "@nestjs/common";
import { QuestionsAnswersController } from "../controllers";
import { QuestionsAnswersDBModule } from "../db/db.module";
import { QuestionsAnswersService } from "../services";
import { QuestionTextAnswerModule } from "./answer-text/modules";
import { QuestionAnswerCheckingModule } from "./checking/modules";
import { QuestionsService } from "#/questions/services";
import { QuestionsDBModule } from "#/questions/modules";
import { TextAnswersService } from "#/answers/text-answer/services";
import { TextAnswersDBModule } from "#/answers/text-answer/modules";

@Module( {
  imports: [
    QuestionsAnswersDBModule,
    QuestionsDBModule,
    TextAnswersDBModule,
    // Submodules
    QuestionTextAnswerModule,
    QuestionAnswerCheckingModule,
  ],
  controllers: [QuestionsAnswersController],
  providers: [
    QuestionsAnswersService,
    QuestionsService,
    TextAnswersService,
  ],
  exports: [
    QuestionsAnswersService,
  ],
} )
export class QuestionsAnswersModule {}
