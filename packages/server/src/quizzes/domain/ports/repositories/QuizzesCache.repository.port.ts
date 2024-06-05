import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { UpdateWriteOpResult } from "mongoose";
import { QuestionAnswerInQuizEntity, ResultQuizPickQuestionsAnswersDto } from "../../models";
import { ReadServicePort } from "../services/ReadService.port";
import { CreateManyService, CreateOneService, DeleteAllService, DeleteOneService } from "#/utils/services/crud";

export interface QuizzesCacheRepositoryPort extends
ReadServicePort,
CreateOneService<QuizEntity>,
CreateManyService<QuizEntity[]>,
DeleteOneService<QuizID>,
DeleteAllService {
  pickQuestionsAnswers(id: QuizID): Promise<ResultQuizPickQuestionsAnswersDto>;
  updateOneQuestionsAnswers(
    id: QuizID, questionsAnswers: QuestionAnswerInQuizEntity[]
  ): Promise<UpdateWriteOpResult>;
  addQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void>;
  removeQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void>;
}

export const QuizzesCacheRepositoryPort = Symbol("QuizzesCacheRepositoryPort");
