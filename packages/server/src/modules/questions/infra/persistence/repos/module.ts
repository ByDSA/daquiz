import { MongooseModule } from "@nestjs/mongoose";
import { EventsService } from "./events.service";
import { RepoImp } from "./repository";
import { Repo } from "./repository.port";
import { Question, QuestionSchema } from "./schemas/schema";
import { QuestionAnswer, QuestionAnswerSchema } from "#modules/question-answers/infra/persistence";
import { CustomEventEmitterModule } from "#modules/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: Question.name,
  schema: QuestionSchema,
}]);

DBModule.imports ??= [
  MongooseModule.forFeature([{
    name: QuestionAnswer.name,
    schema: QuestionAnswerSchema,
  }]),
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
