import { MongooseModule } from "@nestjs/mongoose";
import { QuizCache, QuizCacheSchema } from "./QuizCache";
import { DBService } from "./service";
import { CustomEventEmitterModule } from "#/events/module";

export const DBModule = MongooseModule.forFeature([{
  name: QuizCache.name,
  schema: QuizCacheSchema,
}]);

DBModule.imports ??= [];
DBModule.imports.push(CustomEventEmitterModule);
DBModule.providers ??= [];
DBModule.providers.push(DBService);
