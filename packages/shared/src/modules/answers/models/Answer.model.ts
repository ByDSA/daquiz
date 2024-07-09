import { IsEnum } from "class-validator";
import { AnswerType } from "./AnswerType.enum";

export abstract class AnswerVO {
  @IsEnum(AnswerType)
  type!: AnswerType;
}
