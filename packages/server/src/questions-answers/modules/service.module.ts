import { Module } from "@nestjs/common";
import { QuestionsAnswersDBModule } from "../db/db.module";
import { QuestionsAnswersService } from "../services";
import { TextAnswersModule } from "#/answers/text-answer/modules";
import { EventsModule } from "#/events/module";
import { QuestionsModule } from "#/questions/modules";

@Module( {
  imports: [
    QuestionsAnswersDBModule,
    QuestionsModule,
    TextAnswersModule,
    EventsModule,
  ],
  controllers: [],
  providers: [
    QuestionsAnswersService,
  ],
  exports: [
    QuestionsAnswersService,
    QuestionsModule,
    TextAnswersModule,
  ],
} )
export class QuestionsAnswersServiceModule {}
