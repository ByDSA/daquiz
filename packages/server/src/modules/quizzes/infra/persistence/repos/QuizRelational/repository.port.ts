import { QuizEntity } from "../../../../domain/models";
import { WriteService } from "../Write.service.port";
import { FindAllService } from "#/utils/services/crud";
import { QuestionAnswerRepoFindOptions } from "#modules/questions-answers";

export type RepoFindOptions = {
  include: {
    questionsAnswers: QuestionAnswerRepoFindOptions["includeRelations"];
  };
};

export interface Repo extends
WriteService,
FindAllService<QuizEntity, RepoFindOptions> {
}

export const Repo = Symbol("QuizzesRelationalRepository");
