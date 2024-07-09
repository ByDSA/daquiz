import { Type } from "class-transformer";
import { IsObject, IsString, ValidateNested } from "class-validator";
import { AnswerVO } from "#modules/answers/models/Answer.model";
import { IsAnswer } from "#modules/answers/models/IsAnswer";
import { QuestionVO } from "#modules/questions/models";

export class QuestionAnswerVO {
  @IsObject()
  @ValidateNested()
  @Type(() => QuestionVO)
  question!: QuestionVO;

  @IsObject()
  @ValidateNested()
  @IsAnswer()
  answer!: AnswerVO;
};

export type QuestionAnswerID = string;

export class QuestionAnswerEntity extends QuestionAnswerVO {
  @IsString()
  id!: QuestionAnswerID;
};
