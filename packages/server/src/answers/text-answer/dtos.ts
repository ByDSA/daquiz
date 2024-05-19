import { TextAnswerEntity } from "./models";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

export type CreateTextAnswerDto = {
  text: string;
};

export type ResultOneTextAnswerDto = ResultOneDto<TextAnswerEntity>;

export type ResultManyTextAnswerDto = ResultManyDto<TextAnswerEntity>;
