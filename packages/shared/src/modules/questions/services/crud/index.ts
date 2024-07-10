import { ResultManyDto, ResultOneDto } from "#utils/dtos";
import { IsArray, IsOptional, IsString } from "class-validator";
import { QuestionVO } from "../../models/Question.model";

import "reflect-metadata"; // Para evitar errores de que no encuentra Reflect.getMetadata cuando se importa en otros paquetes

export class TextChoiceDto {
  @IsString()
  text!: string;
}

export class CreateOneQuestionDto {
  @IsString()
  text!: string;

  @IsArray()
  @IsOptional()
  choices?: TextChoiceDto[];
};

export class PatchOneQuestionDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsArray()
  @IsOptional()
  choices?: TextChoiceDto[];
};

export type ResultOneQuestionDto = ResultOneDto<QuestionVO>;

export type ResultManyQuestionDto = ResultManyDto<QuestionVO>;
