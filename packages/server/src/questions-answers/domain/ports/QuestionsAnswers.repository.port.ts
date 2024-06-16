import { CreateQuestionAnswerDto } from "../";
import { QuestionAnswerEntity } from "../models";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";

export type QuestionsAnswersRepositoryFindOptions = Partial<{
  includeRelations: {
    question?: boolean;
    answer?: boolean;
  };
}>;

export interface QuestionsAnswersRepositoryPort extends
CreateOneAndGetService<CreateQuestionAnswerDto, QuestionAnswerEntity>,
FindOneService<QuestionAnswerEntity, QuestionsAnswersRepositoryFindOptions>,
FindAllService<QuestionAnswerEntity, QuestionsAnswersRepositoryFindOptions> {
}

export const QuestionsAnswersRepositoryPort = Symbol("QuestionsAnswersRepositoryPort");
