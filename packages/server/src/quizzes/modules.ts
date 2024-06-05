import { Module } from "@nestjs/common";
import { QuizzesController } from "./controllers";
import { QuizzesCacheDBModule, QuizzesDBModule } from "./db";
import { GenerateQuizzesCacheService, QuizzesService } from "./services";
import { QuizzesCacheRepository } from "./services/repositories/QuizzesCacheRepository";
import { QuizzesRelationalRepository } from "./services/repositories/QuizzesRelationalRepository";
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
  providers: [
    QuizzesService,
    QuizzesCacheRepository,
    QuizzesRelationalRepository,
    GenerateQuizzesCacheService,
  ],
  exports: [],
} )
export class QuizzesModule {}
