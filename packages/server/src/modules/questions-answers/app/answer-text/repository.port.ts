import { CreateQuestionTextAnswerDto, QuestionTextAnswerEntity } from "./domain";
import { CreateOneAndGetService } from "#/utils/services/crud";

export interface Repo
extends CreateOneAndGetService<CreateQuestionTextAnswerDto, QuestionTextAnswerEntity> { }

export const Repo = Symbol("QuestionTextAnswerRepo");
