import { QuizEntity } from "../../../../domain/models";
import { WriteService } from "../Write.service.port";
import { FindAllService, FindOneService } from "#/utils/services/crud";

export type RepoFindOptions = {
  include?: {
    questionsAnswers?: boolean;
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
