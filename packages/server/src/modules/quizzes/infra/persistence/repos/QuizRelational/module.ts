import { MongooseModule } from "@nestjs/mongoose";
import { DBService } from "./events.service";
import { RepoImp } from "./repository";
import { Repo } from "./repository.port";
import { Quiz, SchemaOdm } from "./schemas";
import { QuestionAnswerDBModule } from "#modules/questions-answers/infra/persistence";
import { CustomEventEmitterModule } from "#modules/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: Quiz.name,
  schema: SchemaOdm,
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
