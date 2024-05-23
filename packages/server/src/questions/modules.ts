import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuestionsController } from "./controllers";
import { Question, QuestionSchema } from "./db";
import { QuestionsService } from "./services";

export const QuestionsDBModule = MongooseModule.forFeature([{
  name: Question.name,
  schema: QuestionSchema,
}]);

@Module( {
  imports: [
    QuestionsDBModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsDBModule, QuestionsService],
} )
export class QuestionsModule {}
