import { Type } from "class-transformer";
import { IsObject, IsOptional, IsString } from "class-validator";
import { AnswerID, AnswerType } from "#/answers/models";
import { UnknownAnswerVO } from "#/answers/models/unknown";
import { QuestionID, QuestionVO } from "#/questions/models";

export class QuestionAnswerVO {
  @IsString()
  questionId: QuestionID;

  @IsObject()
  @IsOptional()
  @Type(() => QuestionVO)
  question?: QuestionVO;

  @IsString()
  answerType: AnswerType;

  @IsString()
  answerId: AnswerID;

  @IsObject()
  @IsOptional()
  answer?: UnknownAnswerVO;
};

export type QuestionAnswerID = string;

export class QuestionAnswerEntity extends QuestionAnswerVO {
  @IsString()
  id: QuestionAnswerID;
};
