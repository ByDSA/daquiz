import { IsString } from "class-validator";
import { QuestionEntity } from "./Question";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

export class CreateOneQuestionDto {
  @IsString()
  text!: string;
};

export class PatchOneQuestionDto {
  @IsString()
  text!: string;
};

export type ResultOneQuestionDto = ResultOneDto<QuestionEntity>;

export type ResultManyQuestionDto = ResultManyDto<QuestionEntity>;
