import { MongooseModule } from "@nestjs/mongoose";
import { QuizCache, QuizCacheSchema } from "./QuizCache.schema";
import { DBService } from "./events.service";
import { RepoImp } from "./repository";
import { Repo } from "./repository.port";
import { QuestionAnswerDBModule } from "#modules/question-answers/infra/persistence";
import { CustomEventEmitterModule } from "#modules/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: QuizCache.name,
  schema: QuizCacheSchema,
}]);

DBModule.imports ??= [];
DBModule.imports.push(
  CustomEventEmitterModule,
  QuestionAnswerDBModule,
);
DBModule.providers ??= [];
DBModule.providers.push(
  DBService,
  {
    provide: Repo,
    useClass: RepoImp,
  },
);
