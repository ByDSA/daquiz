import { IsString } from "class-validator";
import { TextAnswerEntity } from "./models";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

export class CreateTextAnswerDto {
  @IsString()
  text: string;
};

export class ResultOneTextAnswerDto extends ResultOneDto<TextAnswerEntity> {};

export class ResultManyTextAnswerDto extends ResultManyDto<TextAnswerEntity> {};
