import { QuestionAnswerEntity } from "../../domain";
import { CreateQuestionAnswerDto } from "../domain";
import { CreateOneAndGetService, FindAllService, FindOneService } from "#/utils/services/crud";

export interface Repo extends
CreateOneAndGetService<CreateQuestionAnswerDto, QuestionAnswerEntity>,
FindOneService<QuestionAnswerEntity>,
FindAllService<QuestionAnswerEntity> {
}

export const Repo = Symbol("QuestionAnswerRepo");
