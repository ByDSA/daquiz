import { MongooseModule } from "@nestjs/mongoose";
import { Quiz, SchemaOdm } from "./Quiz";
import { DBService } from "./service";
import { CustomEventEmitterModule } from "#/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: Quiz.name,
  schema: SchemaOdm,
}]);

DBModule.imports ??= [];
DBModule.imports.push(CustomEventEmitterModule);
DBModule.providers ??= [];
DBModule.providers.push(DBService);
