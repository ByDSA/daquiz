import { MongooseModule } from "@nestjs/mongoose";
import { QuizCache, SchemaOdm } from "./QuizCache";

export const DBModule = MongooseModule.forFeature([{
  name: QuizCache.name,
  schema: SchemaOdm,
}]);
