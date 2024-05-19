import { TextQuestionEntity } from "./models";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

export type CreateTextQuestionDto = {
  text: string;
};

export type ResultOneTextQuestionDto = ResultOneDto<TextQuestionEntity>;

export type ResultManyTextQuestionDto = ResultManyDto<TextQuestionEntity>;
