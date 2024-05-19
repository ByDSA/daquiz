import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TextQuestionsController } from "./controllers";
import { TextQuestion, TextQuestionSchema } from "./db";
import { TextQuestionsService } from "./services";

export const TextQuestionsDBModule = MongooseModule.forFeature([{
  name: TextQuestion.name,
  schema: TextQuestionSchema,
}]);

@Module( {
  imports: [
    TextQuestionsDBModule,
  ],
  controllers: [TextQuestionsController],
  providers: [TextQuestionsService],
  exports: [TextQuestionsDBModule, TextQuestionsService],
} )
export class TextQuestionsModule {}
