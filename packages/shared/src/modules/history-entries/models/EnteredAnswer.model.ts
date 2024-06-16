import { IsEnum, IsString } from "class-validator";
import { AnswerType } from "#modules/answers/models";

export class EnteredAnswer {
  @IsEnum(AnswerType)
  answerType!: AnswerType;

  @IsString()
  answer!: object;
}
