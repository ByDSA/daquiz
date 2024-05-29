import { MongooseModule } from "@nestjs/mongoose";
import { SchemaClass, SchemaDoc } from "./schema";
import { Service } from "./service";
import { EventsModule } from "#/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: SchemaClass.name,
  schema: SchemaDoc,
}]);

DBModule.imports ??= [];
DBModule.imports.push(EventsModule);
DBModule.providers ??= [];
DBModule.providers.push(Service);
