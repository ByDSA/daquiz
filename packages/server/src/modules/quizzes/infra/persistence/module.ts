import { TextAnswerDBModule } from "#/modules/answers/submodules/text-answer";
import { QuestionDBModule } from "#/modules/questions";
import { Module } from "@nestjs/common";
import { QuizCacheDBModule } from "./repos/QuizCache";
import { QuizRelationalDBModule } from "./repos/QuizRelational";
import { RepoImp } from "./repos/repository";
import { Repo } from "./repos/repository.port";
import { GenerateQuizzesCacheServiceImp } from "./services/GenerateQuizzesCache.service";
import { GenerateQuizzesCacheService } from "./services/GenerateQuizzesCache.service.port";

@Module( {
  imports: [
    QuestionDBModule,
    TextAnswerDBModule,
    QuizCacheDBModule,
    QuizRelationalDBModule,
  ],
  controllers: [],
  providers: [
    {
      provide: Repo,
      useClass: RepoImp,
    },
    {
      provide: GenerateQuizzesCacheService,
      useClass: GenerateQuizzesCacheServiceImp,
    },
  ],
  exports: [
    QuizCacheDBModule,
    QuizRelationalDBModule,
    Repo,
  ],
} )
export class DBModule {}
