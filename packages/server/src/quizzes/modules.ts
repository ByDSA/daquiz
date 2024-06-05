import { Module } from "@nestjs/common";
import { GenerateQuizzesCacheService, QuizzesService } from "./application";
import { GenerateQuizzesCacheServicePort, QuizzesServicePort } from "./domain";
import { QuizzesCacheRepositoryPort } from "./domain/ports/repositories/QuizzesCache.repository.port";
import { QuizzesRelationalRepositoryPort } from "./domain/ports/repositories/QuizzesRelational.repository.port";
import { QuizzesCacheDBModule, QuizzesCacheRepository, QuizzesController, QuizzesDBModule, QuizzesRelationalRepository } from "./infrastructure";
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
    {
      provide: QuizzesServicePort,
      useClass: QuizzesService,
    },
    {
      provide: QuizzesCacheRepositoryPort,
      useClass: QuizzesCacheRepository,
    },
    {
      provide: QuizzesRelationalRepositoryPort,
      useClass: QuizzesRelationalRepository,
    },
    {
      provide: GenerateQuizzesCacheServicePort,
      useClass: GenerateQuizzesCacheService,
    },
  ],
  exports: [],
} )
export class QuizzesModule {}
