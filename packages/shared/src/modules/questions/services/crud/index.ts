import { IsArray, IsOptional, IsString } from "class-validator";
import { QuestionEntity } from "../../models/Question.model";
import { ResultManyDto, ResultOneDto } from "#utils/dtos";

import "reflect-metadata"; // Para evitar errores de que no encuentra Reflect.getMetadata cuando se importa en otros paquetes

export class ChoiceDto {
  @IsString()
  @IsOptional()
  text?: string;
}

export class CreateOneQuestionDto {
  @IsString()
  text?: string;

  @IsArray()
  @IsOptional()
  choices?: ChoiceDto[];
};

export class PatchOneQuestionDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsArray()
  @IsOptional()
  choices?: ChoiceDto[];
};

export type ResultOneQuestionDto = ResultOneDto<QuestionEntity>;

export type ResultManyQuestionDto = ResultManyDto<QuestionEntity>;
