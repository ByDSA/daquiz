import { MongooseModule } from "@nestjs/mongoose";
import { SchemaClass, SchemaDoc } from "./schema";
import { Service } from "./service";
import { CustomEventEmitterModule } from "#/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: SchemaClass.name,
  schema: SchemaDoc,
}]);

DBModule.imports ??= [];
DBModule.imports.push(CustomEventEmitterModule);
DBModule.providers ??= [];
DBModule.providers.push(Service);
