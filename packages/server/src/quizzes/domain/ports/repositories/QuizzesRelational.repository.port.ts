import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { WriteServicePort } from "../services/WriteService.port";
import { FindQuestionsAnswersOptions } from "#/questions-answers/services";
import { FindAllService } from "#/utils/services/crud";

export type QuizzesRelationalRepositoryFindOptions = {
  include: {
    questionsAnswers: FindQuestionsAnswersOptions["includeRelations"];
  };
};

export interface QuizzesRelationalRepositoryPort extends
WriteServicePort,
FindAllService<QuizEntity> {
  findAll(options?: QuizzesRelationalRepositoryFindOptions): Promise<QuizEntity[]>;
}

export const QuizzesRelationalRepositoryPort = Symbol("QuizzesRelationalRepositoryPort");
