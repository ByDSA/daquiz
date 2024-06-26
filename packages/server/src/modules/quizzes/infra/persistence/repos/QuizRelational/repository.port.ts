import { QuizEntity } from "../../../../domain/models";
import { WriteService } from "../Write.service.port";
import { FindAllService, FindOneService } from "#/utils/services/crud";
import { QuestionAnswerRepoFindOptions } from "#modules/questions-answers";

export type RepoFindOptions = {
  include?: {
    questionsAnswers?: QuestionAnswerRepoFindOptions["includeRelations"];
    subquizzes?: boolean;
  };
};

export interface Repo extends
WriteService,
FindAllService<QuizEntity, RepoFindOptions>,
FindOneService<QuizEntity, RepoFindOptions>
{
}

export const Repo = Symbol("QuizzesRelationalRepository");
