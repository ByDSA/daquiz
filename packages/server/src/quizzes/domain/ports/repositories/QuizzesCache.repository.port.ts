import { UpdateWriteOpResult } from "mongoose";
import { QuestionAnswerInQuizEntity, QuizEntity, QuizID } from "../../models";
import { ReadServicePort } from "../services/ReadService.port";
import { CreateManyService, CreateOneService, DeleteAllService, DeleteOneService } from "#/utils/services/crud";
import { QuestionAnswerID } from "#/questions-answers/domain";

export interface QuizzesCacheRepositoryPort extends
ReadServicePort,
CreateOneService<QuizEntity>,
CreateManyService<QuizEntity[]>,
DeleteOneService<QuizID>,
DeleteAllService {
  updateOneQuestionsAnswers(
    id: QuizID, questionsAnswers: QuestionAnswerInQuizEntity[]
  ): Promise<UpdateWriteOpResult>;
  addQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void>;
  removeQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void>;
}

export const QuizzesCacheRepositoryPort = Symbol("QuizzesCacheRepositoryPort");
