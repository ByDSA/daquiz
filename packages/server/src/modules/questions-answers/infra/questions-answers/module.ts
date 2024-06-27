import { Module } from "@nestjs/common";
import { QuestionAnswerController } from "./controller";
import { QuestionAnswerDBModule } from "./persistence";
import { TextAnswerDBModule } from "#/modules/answers/submodules/text-answer";
import { QuestionDBModule } from "#/modules/questions/infra";
import { CustomEventEmitterModule } from "#modules/events/module";

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
