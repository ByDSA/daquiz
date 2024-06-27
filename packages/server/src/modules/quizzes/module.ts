import { Module } from "@nestjs/common";
import { QuestionAnswerPickerServiceImp } from "./app/QuestionAnswerPicker.service";
import { QuestionAnswerPickerService } from "./app/QuestionAnswerPicker.service.port";
import { QuizzesController } from "./infra";
import { QuizDBModule } from "./infra/persistence";
import { QuestionsAnswersModule } from "#modules/questions-answers/";
import { HistoryEntryModule } from "#modules/history-entries";
import { CustomEventEmitterModule } from "#modules/events/module";

@Module( {
  imports: [
    QuestionsAnswersModule,
    HistoryEntryModule,
    QuizDBModule,
    CustomEventEmitterModule,
  ],
  controllers: [QuizzesController],
  providers: [
    {
      provide: QuestionAnswerPickerService,
      useClass: QuestionAnswerPickerServiceImp,
    },
  ],
  exports: [],
} )
export class QuizzesModule {}
