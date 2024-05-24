import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";
import { QuestionAnswerEntity, QuestionAnswerID } from "../questions-answers/QuestionAnswer";

export class QuizVO {
  @IsArray()
  questionAnswersIds!: QuestionAnswerID[];

  @IsArray()
  @IsOptional()
  @Type(() => QuestionAnswerEntity)
  questionAnswers?: QuestionAnswerEntity[];
};

export type QuizID = string;

export class QuizEntity extends QuizVO {
  @IsString()
  id!: QuizID;
};
