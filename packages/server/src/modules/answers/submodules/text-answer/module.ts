import { Module } from "@nestjs/common";
import { TextAnswersController } from "./infra/controller";
import { TextAnswerDBModule } from "./infra/persistence";

@Module( {
  imports: [
    TextAnswerDBModule,
  ],
  controllers: [TextAnswersController],
  providers: [],
  exports: [TextAnswerDBModule],
} )
export class TextAnswersModule {}
