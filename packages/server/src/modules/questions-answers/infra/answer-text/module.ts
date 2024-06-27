import { Module } from "@nestjs/common";
import { QuestionAnswerDBModule } from "../questions-answers";
import { QuestionTextAnswerController } from "./controller";
import { RepoImp } from "./repository";
import { Repo } from "./repository.port";
import { CustomEventEmitterModule } from "#modules/events/module";
import { QuestionDBModule } from "#/modules/questions/infra";
import { TextAnswerDBModule } from "#/modules/answers/submodules/text-answer";

@Module( {
  imports: [
    CustomEventEmitterModule,
    QuestionDBModule,
    TextAnswerDBModule,
    QuestionAnswerDBModule,
  ],
  controllers: [QuestionTextAnswerController],
  providers: [
    {
      provide: Repo,
      useClass: RepoImp,
    },
  ],
} )
export class QuestionTextAnswerModule {}
