import { MongooseModule } from "@nestjs/mongoose";
import { Quiz, SchemaOdm } from "./Quiz";
import { DBService } from "./service";
import { EventsModule } from "#/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: Quiz.name,
  schema: SchemaOdm,
}]);

DBModule.imports ??= [];
DBModule.imports.push(EventsModule);
DBModule.providers ??= [];
DBModule.providers.push(DBService);
