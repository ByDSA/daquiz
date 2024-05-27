import { IsString } from "class-validator";
import { TextAnswerEntity } from "./TextAnswer";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

export class CreateTextAnswerDto {
  @IsString()
  text!: string;
};

export class PatchOneTextAnswerDto {
  @IsString()
  text!: string;
};

export class ResultOneTextAnswerDto extends ResultOneDto<TextAnswerEntity> {};

export class ResultManyTextAnswerDto extends ResultManyDto<TextAnswerEntity> {};
