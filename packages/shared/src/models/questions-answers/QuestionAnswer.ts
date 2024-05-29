import { Type } from "class-transformer";
import { IsObject, IsOptional, IsString } from "class-validator";
import { AnswerID, AnswerType } from "../answers/Answer";
import { UnknownAnswerVO } from "../answers/unknown-answers/UnknownAnswer";
import { QuestionID, QuestionVO } from "../questions/Question";

export class QuestionAnswerVO {
  @IsString()
  questionId!: QuestionID;

  @IsString()
  answerType!: AnswerType;

  @IsString()
  answerId!: AnswerID;

  @IsObject()
  @IsOptional()
  @Type(() => QuestionVO)
  question?: QuestionVO;

  @IsObject()
  @IsOptional()
  answer?: UnknownAnswerVO;
};

export type QuestionAnswerID = string;

export class QuestionAnswerEntity extends QuestionAnswerVO {
  @IsString()
  id!: QuestionAnswerID;
};
