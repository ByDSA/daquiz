import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";
import { QuestionAnswerID } from "../questions-answers/QuestionAnswer";
import { QuestionAnswerInQuizEntity } from "./QuestionAnswerInQuiz";

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
