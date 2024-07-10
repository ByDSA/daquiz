import { Module } from "@nestjs/common";
import { QuestionAnswerController } from "./controller";
import { QuestionAnswerDBModule } from "./persistence";
import { TextAnswerDBModule } from "#modules/answers/submodules/text-answer";
import { CustomEventEmitterModule } from "#modules/events/module";
import { QuestionDBModule } from "#modules/questions/infra";

@Module( {
  imports: [
    CustomEventEmitterModule,
    QuestionDBModule,
    TextAnswerDBModule,
    QuestionAnswerDBModule,
  ],
  controllers: [QuestionAnswerController],
  providers: [],
} )
export class QuestionAnswerModule {}
