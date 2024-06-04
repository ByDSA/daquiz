import { MongooseModule } from "@nestjs/mongoose";
import { QuizCache, QuizCacheSchema } from "./QuizCache";

export const DBModule = MongooseModule.forFeature([{
  name: QuizCache.name,
  schema: QuizCacheSchema,
}]);
