import { MongooseModule } from "@nestjs/mongoose";
import { QuizCache, QuizCacheSchema } from "./QuizCache";
import { DBService } from "./service";
import { EventsModule } from "#/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: QuizCache.name,
  schema: QuizCacheSchema,
}]);

DBModule.imports ??= [];
DBModule.imports.push(EventsModule);
DBModule.providers ??= [];
DBModule.providers.push(DBService);
