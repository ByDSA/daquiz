import { Type } from "class-transformer";
import { IsObject, IsString } from "class-validator";
import { QuizID, QuizVO } from "./Quiz.model";

export class SubquizVO {
  @IsObject()
  @Type(() => QuizVO)
  quiz?: QuizVO;

  @IsString()
  id!: QuizID;
};
