import { MongooseModule } from "@nestjs/mongoose";
import { RepoImp } from "./repository";
import { Repo } from "./repository.port";
import { QuestionAnswer, QuestionAnswerSchema } from "./schema";
import { QuestionsModule } from "#modules/questions/module";
import { TextAnswersModule } from "#modules/answers/submodules/text-answer/module";

export const DBModule = MongooseModule.forFeature([{
  name: QuestionAnswer.name,
  schema: QuestionAnswerSchema,
}]);

DBModule.imports ??= [];
DBModule.imports.push(QuestionsModule, TextAnswersModule);

DBModule.providers ??= [];
DBModule.providers.push( {
  provide: Repo,
  useClass: RepoImp,
} );

DBModule.exports ??= [
  QuestionsModule,
  TextAnswersModule,
];
