import { Type } from "class-transformer";
import { IsObject, IsOptional, IsString } from "class-validator";
import { AnswerID, AnswerType, UnknownAnswerVO } from "#modules/answers/models";
import { QuestionID, QuestionVO } from "#modules/questions/models";

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
