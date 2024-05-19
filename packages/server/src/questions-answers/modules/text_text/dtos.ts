import { TextQuestionTextAnswerEntity } from "./models";
import { ResultOneDto } from "#/utils/dtos";

export type CreateTextQuestionTextAnswerDto = {
  question: string;
  answer: string;
};

export type ResultOneTextQuestionTextAnswerDto = ResultOneDto<TextQuestionTextAnswerEntity>;
