import { QuestionAnswerEntity, QuestionAnswerVO } from "./models";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

export type CreateQuestionAnswerDto = {
  questionType: QuestionAnswerVO["questionType"];
  questionId: QuestionAnswerVO["questionId"];
  answerType: QuestionAnswerVO["answerType"];
  answerId: QuestionAnswerVO["answerId"];
};

export type ResultOneTextQuestionDto = ResultOneDto<QuestionAnswerEntity>;

export type ResultManyTextQuestionDto = ResultManyDto<QuestionAnswerEntity>;
