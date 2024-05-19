import { Module } from "@nestjs/common";
import { QuestionsAnswersDBModule } from "../../db/db.module";
import { QuestionsAnswersService } from "../../services";
import { TextQuestionTextAnswerController } from "./controllers";
import { TextQuestionTextAnswerService } from "./services";
import { TextQuestionsService } from "#/questions/text-question/services";
import { TextQuestionsDBModule } from "#/questions/text-question/modules";
import { TextAnswersService } from "#/answers/text-answer/services";
import { TextAnswersDBModule } from "#/answers/text-answer/modules";

@Module( {
  imports: [
    TextQuestionsDBModule,
    TextAnswersDBModule,
    QuestionsAnswersDBModule,
  ],
  controllers: [TextQuestionTextAnswerController],
  providers: [
    TextQuestionTextAnswerService,
    QuestionsAnswersService,
    TextQuestionsService,
    TextAnswersService,
  ],
} )
export class TextQuestionTextAnswerModule {}
