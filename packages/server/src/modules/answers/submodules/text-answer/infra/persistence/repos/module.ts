import { MongooseModule } from "@nestjs/mongoose";
import { EventsService } from "./events.service";
import { RepoImp } from "./repository";
import { Repo } from "./repository.port";
import { SchemaClass, SchemaOdm } from "./schemas";
import { CustomEventEmitterModule } from "#modules/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: SchemaClass.name,
  schema: SchemaOdm,
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
