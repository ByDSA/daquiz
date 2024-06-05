import { MongooseModule } from "@nestjs/mongoose";
import { QuestionAnswer, QuestionAnswerSchema } from "./schemas";

export const QuestionsAnswersDBModule = MongooseModule.forFeature([{
  name: QuestionAnswer.name,
  schema: QuestionAnswerSchema,
}]);
