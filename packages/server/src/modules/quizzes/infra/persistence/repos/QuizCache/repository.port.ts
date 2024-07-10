import { UpdateWriteOpResult } from "mongoose";
import { QuizEntity, QuizID } from "../../../../domain/models";
import { ReadService } from "../Read.service.port";
import { CreateManyService, CreateOneService, DeleteAllService, DeleteOneByIdService } from "#utils/services/crud";
import { QuestionAnswerEntity, QuestionAnswerID } from "#modules/question-answers/domain";

export interface Repo extends
ReadService,
CreateOneService<QuizEntity>,
CreateManyService<QuizEntity[]>,
DeleteOneByIdService<QuizID>,
DeleteAllService {
  updateOneQuestionsAnswers(
    id: QuizID, questionsAnswers: QuestionAnswerEntity[]
  ): Promise<UpdateWriteOpResult>;
  addQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void>;
  removeQuestionsAnswers(id: QuizID, ids: QuestionAnswerID[]): Promise<void>;
}

export const Repo = Symbol("QuizzesCacheRepository");
