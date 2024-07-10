import { CustomEventEmitterModule } from "#modules/events/module";
import { Module } from "@nestjs/common";
import { QuestionDBModule } from "./infra";
import { QuestionController } from "./infra/controller";

@Module( {
  imports: [
    QuestionDBModule,
    CustomEventEmitterModule,
  ],
  controllers: [QuestionController],
  providers: [],
  exports: [QuestionDBModule],
} )
export class QuestionsModule {}
