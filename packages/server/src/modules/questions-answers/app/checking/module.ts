import { Module } from "@nestjs/common";
import { QuestionAnswerDBModule } from "../../infra";
import { ServiceImp } from "./app/service";
import { Service } from "./app/service.port";
import { QuestionAnswerCheckingController } from "./controller";
import { QuestionsModule } from "#modules/questions";
import { HistoryEntryModule } from "#modules/history-entries";
import { TextAnswersModule } from "#modules/answers/submodules/text-answer";

@Module( {
  imports: [
    HistoryEntryModule,
    QuestionsModule,
    TextAnswersModule,
    QuestionAnswerDBModule,
  ],
  controllers: [QuestionAnswerCheckingController],
  providers: [{
    provide: Service,
    useClass: ServiceImp,
  }],
} )
export class QuestionAnswerCheckingModule {}
