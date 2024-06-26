import { Module } from "@nestjs/common";
import { DBModule } from "../../infra/persistence/repos/module";
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
    DBModule,
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
