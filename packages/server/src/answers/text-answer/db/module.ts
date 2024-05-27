import { MongooseModule } from "@nestjs/mongoose";
import { SchemaOdm, SchemaOdmClass } from "./schema";
import { Service } from "./service";
import { EventsModule } from "#/events/module";

export const Module = MongooseModule.forFeature([{
  name: SchemaOdmClass.name,
  schema: SchemaOdm,
}]);

Module.imports ??= [];
Module.imports.push(EventsModule);
Module.providers ??= [];
Module.providers.push(Service);
