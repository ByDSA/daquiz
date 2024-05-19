import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TextAnswersController } from "./controllers";
import { TextAnswer, TextAnswerSchema } from "./db";
import { TextAnswersService } from "./services";

export const TextAnswersDBModule = MongooseModule.forFeature([{
  name: TextAnswer.name,
  schema: TextAnswerSchema,
}]);

@Module( {
  imports: [
    TextAnswersDBModule,
  ],
  controllers: [TextAnswersController],
  providers: [TextAnswersService],
  exports: [TextAnswersDBModule, TextAnswersService],
} )
export class TextAnswersModule {}
