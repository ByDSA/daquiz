import { QuizEntity } from "../../models";
import { WriteServicePort } from "../services/WriteService.port";
import { QuestionsAnswersRepositoryFindOptions } from "#/questions-answers/domain";
import { FindAllService } from "#/utils/services/crud";

export type QuizzesRelationalRepositoryFindOptions = {
  include: {
    questionsAnswers: QuestionsAnswersRepositoryFindOptions["includeRelations"];
  };
};

export interface QuizzesRelationalRepositoryPort extends
WriteServicePort,
FindAllService<QuizEntity, QuizzesRelationalRepositoryFindOptions> {
}

export const QuizzesRelationalRepositoryPort = Symbol("QuizzesRelationalRepositoryPort");
