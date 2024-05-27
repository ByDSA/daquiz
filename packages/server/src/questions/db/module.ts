import { MongooseModule } from "@nestjs/mongoose";
import { Question, QuestionSchema } from "./schema";
import { QuestionDBService } from "./service";
import { EventsModule } from "#/events/module";

export const QuestionsDBModule = MongooseModule.forFeature([{
  name: Question.name,
  schema: QuestionSchema,
}]);

QuestionsDBModule.imports ??= [];
QuestionsDBModule.imports.push(EventsModule);
QuestionsDBModule.providers ??= [];
QuestionsDBModule.providers.push(QuestionDBService);
