import { Module } from "@nestjs/common";
import { QuestionsAnswersServiceModule } from "../service.module";
import { QuestionAnswerCheckingController } from "./controllers";
import { QuestionAnswerCheckingService } from "./services/QuestionAnswerChecking.service";
import { QuestionAnswerCheckingServicePort } from "./services/QuestionAnswerChecking.service.port";
import { QuestionsModule } from "#/questions";
import { HistoryEntriesModule } from "#/historyEntries";
import { TextAnswersModule } from "#/answers/text-answer";

@Module( {
  imports: [
    HistoryEntriesModule,
    QuestionsAnswersServiceModule,
    QuestionsModule,
    TextAnswersModule,
  ],
  controllers: [QuestionAnswerCheckingController],
  providers: [
    {
      provide: QuestionAnswerCheckingServicePort,
      useClass: QuestionAnswerCheckingService,
    },
  ],
} )
export class QuestionAnswerCheckingModule {}
