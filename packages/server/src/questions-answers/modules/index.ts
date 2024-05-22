import { Module } from "@nestjs/common";
import { QuestionsAnswersController } from "../controllers";
import { QuestionsAnswersDBModule } from "../db/db.module";
import { QuestionsAnswersService } from "../services";
import { QuestionAnswerCheckingModule } from "./checking/modules";
import { TextQuestionTextAnswerModule } from "./text_text/modules";
import { TextQuestionsService } from "#/questions/text-question/services";
import { TextQuestionsDBModule } from "#/questions/text-question/modules";
import { TextAnswersService } from "#/answers/text-answer/services";
import { TextAnswersDBModule } from "#/answers/text-answer/modules";

@Module( {
  imports: [
    QuestionsAnswersDBModule,
    TextQuestionsDBModule,
    TextAnswersDBModule,
    // Submodules
    TextQuestionTextAnswerModule,
    QuestionAnswerCheckingModule,
  ],
  controllers: [QuestionsAnswersController],
  providers: [
    QuestionsAnswersService,
    TextQuestionsService,
    TextAnswersService,
  ],
} )
export class QuestionsAnswersModule {}
