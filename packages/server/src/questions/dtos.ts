import { IsString } from "class-validator";
import { QuestionEntity } from "./models";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

export class CreateQuestionDto {
  @IsString()
  text: string;
};

export type ResultOneQuestionDto = ResultOneDto<QuestionEntity>;

export type ResultManyQuestionDto = ResultManyDto<QuestionEntity>;
