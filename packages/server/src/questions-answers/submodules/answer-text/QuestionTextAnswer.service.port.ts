import { CreateQuestionTextAnswerDto, QuestionTextAnswerEntity } from "./domain";
import { CreateOneAndGetService } from "#/utils/services/crud";

export interface QuestionTextAnswerServicePort
extends CreateOneAndGetService<CreateQuestionTextAnswerDto, QuestionTextAnswerEntity> { }

export const QuestionTextAnswerServicePort = Symbol("QuestionTextAnswerServicePort");
