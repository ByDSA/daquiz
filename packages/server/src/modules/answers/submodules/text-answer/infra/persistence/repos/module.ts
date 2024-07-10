import { QuestionAnswer, QuestionAnswerSchema } from "#/modules/question-answers/infra/persistence/schema";
import { CustomEventEmitterModule } from "#modules/events/module";
import { MongooseModule } from "@nestjs/mongoose";
import { EventsService } from "./events.service";
import { RepoImp } from "./repository";
import { Repo } from "./repository.port";
import { SchemaClass, SchemaOdm } from "./schemas";

export const DBModule = MongooseModule.forFeature([{
  name: SchemaClass.name,
  schema: SchemaOdm,
}]);

DBModule.imports ??= [
  MongooseModule.forFeature([{
    name: QuestionAnswer.name,
    schema: QuestionAnswerSchema,
  }])
];
DBModule.imports.push(CustomEventEmitterModule);
DBModule.providers ??= [];
DBModule.providers.push(
  EventsService,
  {
    provide: Repo,
    useClass: RepoImp,
  },
);
