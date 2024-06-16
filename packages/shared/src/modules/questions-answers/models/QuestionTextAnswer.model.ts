import { IsOptional, IsString, ValidateNested } from "class-validator";
import { AnswerID, TextAnswerVO } from "#modules/answers/models";
import { QuestionID, QuestionVO } from "#modules/questions/models";

export class QuestionTextAnswerVO {
  @IsString()
  questionId!: QuestionID;

  @IsOptional()
  @ValidateNested()
  question?: QuestionVO;

  @IsString()
  answerId!: AnswerID;

  @IsOptional()
  @ValidateNested()
  answer?: TextAnswerVO;
};

export class QuestionTextAnswerEntity extends QuestionTextAnswerVO {
  @IsString()
  id!: string;
};
