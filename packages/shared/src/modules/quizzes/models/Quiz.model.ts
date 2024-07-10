/* eslint-disable no-use-before-define */
import { Type } from "class-transformer";
import { IsArray, IsObject, IsOptional, IsString } from "class-validator";
import { QuestionAnswerEntity, QuestionAnswerID } from "#modules/question-answers/models";

export class QuizVO {
  @IsString()
  name!: string;

  @IsArray()
  questionAnswersIds!: QuestionAnswerID[];

  @IsArray()
  @IsOptional()
  @Type(() => QuestionAnswerEntity)
  questionAnswers?: QuestionAnswerEntity[];

  @IsArray()
  @IsOptional()
  @Type(() => SubquizVO)
  subquizzes?: SubquizVO[];
};

export type QuizID = string;

export class SubquizVO {
  @IsObject()
  @Type(() => QuizVO)
  quiz?: QuizVO;

  @IsString()
  id!: QuizID;
};

export class QuizEntity extends QuizVO {
  @IsString()
  id!: QuizID;
};

class ArrayUpdate<T> {
  @IsOptional()
  @IsArray()
  added?: T[];

  @IsOptional()
  @IsArray()
  removed?: T[];
};

export class QuizUpdateEntity {
  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @Type(() => ArrayUpdate<QuestionAnswerID>)
  questionAnswersIds?: ArrayUpdate<QuestionAnswerID>;

  @IsArray()
  @Type(() => ArrayUpdate<QuestionAnswerID>)
  questionAnswers?: ArrayUpdate<QuestionAnswerEntity>;
};
