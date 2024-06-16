import { Type } from "class-transformer";
import { IsArray } from "class-validator";
import { QuestionChoice } from "./QuestionChoice.model";
import { QuestionMultimedia } from "./QuestionMultimedia.model";

export class QuestionGroup extends QuestionMultimedia {
  @IsArray()
  @Type(() => QuestionChoice)
  choices!: QuestionChoice[];
};
