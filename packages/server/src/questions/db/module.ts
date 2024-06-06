import { MongooseModule } from "@nestjs/mongoose";
import { Question, QuestionSchema } from "./schema";
import { QuestionDBService } from "./service";
import { CustomEventEmitterModule } from "#/events/module";

export const QuestionsDBModule = MongooseModule.forFeature([{
  name: Question.name,
  schema: QuestionSchema,
}]);

QuestionsDBModule.imports ??= [];
QuestionsDBModule.imports.push(CustomEventEmitterModule);
QuestionsDBModule.providers ??= [];
QuestionsDBModule.providers.push(QuestionDBService);
