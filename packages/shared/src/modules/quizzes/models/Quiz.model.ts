import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";
import { QuestionAnswerInQuizEntity } from "./QuestionAnswerInQuiz.model";
import { QuestionAnswerID } from "#modules/questions-answers/models";

export class QuizVO {
  @IsString()
  name!: string;

  @IsArray()
  questionAnswersIds!: QuestionAnswerID[];

  @IsArray()
  @IsOptional()
  @Type(() => QuestionAnswerInQuizEntity)
  questionAnswers?: QuestionAnswerInQuizEntity[];
};

export type QuizID = string;

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
  questionAnswers?: ArrayUpdate<QuestionAnswerInQuizEntity>;
};