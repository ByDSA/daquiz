import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

import "reflect-metadata"; // Para evitar errores de que no encuentra Reflect.getMetadata cuando se importa en otros paquetes
import { QuestionChoice } from "./QuestionChoice.model";
import { QuestionGroup } from "./QuestionGroup.model";
import { QuestionMultimedia } from "./QuestionMultimedia.model";

export class QuestionVO extends QuestionMultimedia {
  @IsArray()
  @IsOptional()
  groups?: QuestionGroup[];

  @IsArray()
  @IsOptional()
  @Type(() => QuestionChoice)
  choices?: QuestionChoice[];
};

export type QuestionID = string;

export class QuestionEntity extends QuestionVO {
  @IsString()
  id!: QuestionID;
};
