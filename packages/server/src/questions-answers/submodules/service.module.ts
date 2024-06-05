import { Module } from "@nestjs/common";
import { QuestionsAnswersRepositoryPort } from "../domain";
import { QuestionsAnswersDBModule } from "../infrastructure/db/db.module";
import { QuestionsAnswersRepository } from "../infrastructure/repositories/QuestionsAnswers.repository";
import { QuestionsModule } from "#/questions";
import { EventsModule } from "#/events/module";
import { TextAnswersModule } from "#/answers/text-answer";

@Module( {
  imports: [
    QuestionsAnswersDBModule,
    QuestionsModule,
    TextAnswersModule,
    EventsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: QuestionsAnswersRepositoryPort,
      useClass: QuestionsAnswersRepository,
    },
  ],
  exports: [
    QuestionsAnswersRepositoryPort,
    QuestionsModule,
    TextAnswersModule,
  ],
} )
export class QuestionsAnswersServiceModule {}
