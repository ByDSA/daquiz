import { Module } from "@nestjs/common";
import { QuizzesController } from "./controllers";
import { QuizzesCacheDBModule, QuizzesDBModule } from "./db";
import { QuizzesReadService, QuizzesWriteService } from "./services";
import { QuestionsAnswersModule } from "#/questions-answers/modules";
import { HistoryEntriesModule } from "#/historyEntries/modules";
import { EventsModule } from "#/events/module";

@Module( {
  imports: [
    QuestionsAnswersModule,
    HistoryEntriesModule,
    QuizzesCacheDBModule,
    QuizzesDBModule,
    EventsModule,
  ],
  controllers: [QuizzesController],
  providers: [QuizzesReadService, QuizzesWriteService],
  exports: [],
} )
export class QuizzesModule {}
