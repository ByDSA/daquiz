import { MongooseModule } from "@nestjs/mongoose";
import { EventsService } from "./events.service";
import { RepoImp } from "./repository";
import { Repo } from "./repository.port";
import { SchemaClass, SchemaDoc } from "./schemas";
import { CustomEventEmitterModule } from "#modules/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: SchemaClass.name,
  schema: SchemaDoc,
}]);

DBModule.imports ??= [];
DBModule.imports.push(CustomEventEmitterModule);
DBModule.providers ??= [];
DBModule.providers.push(
  EventsService,
  {
    provide: Repo,
    useClass: RepoImp,
  },
);
