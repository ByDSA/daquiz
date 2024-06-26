import { UpdateWriteOpResult } from "mongoose";
import { QuestionAnswerInQuizEntity, QuizEntity, QuizID } from "../../../../domain/models";
import { ReadService } from "../Read.service.port";
import { QuestionAnswerID } from "#modules/questions-answers/domain";
import { CreateManyService, CreateOneService, DeleteAllService, DeleteOneService } from "#/utils/services/crud";

export interface Repo extends
ReadService,
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

export const Repo = Symbol("QuizzesCacheRepository");
