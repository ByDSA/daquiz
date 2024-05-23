import { Module } from "@nestjs/common";
import { QuestionsAnswersDBModule } from "../../db/db.module";
import { QuestionsAnswersService } from "../../services";
import { QuestionTextAnswerController } from "./controllers";
import { QuestionTextAnswerService } from "./services";
import { QuestionsService } from "#/questions/services";
import { QuestionsDBModule } from "#/questions/modules";
import { TextAnswersService } from "#/answers/text-answer/services";
import { TextAnswersDBModule } from "#/answers/text-answer/modules";

@Module( {
  imports: [
    QuestionsDBModule,
    TextAnswersDBModule,
    QuestionsAnswersDBModule,
  ],
  controllers: [QuestionTextAnswerController],
  providers: [
    QuestionTextAnswerService,
    QuestionsAnswersService,
    QuestionsService,
    TextAnswersService,
  ],
} )
export class QuestionTextAnswerModule {}
