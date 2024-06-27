import { QuestionAnswerEntity } from "../../../domain";
import { CreateQuestionAnswerDto } from "../domain";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";

export type RepoFindOptions = Partial<{
  includeRelations: {
    question?: boolean;
    answer?: boolean;
  };
}>;

export interface Repo extends
CreateOneAndGetService<CreateQuestionAnswerDto, QuestionAnswerEntity>,
FindOneService<QuestionAnswerEntity, RepoFindOptions>,
FindAllService<QuestionAnswerEntity, RepoFindOptions> {
}

export const Repo = Symbol("QuestionAnswerRepo");
