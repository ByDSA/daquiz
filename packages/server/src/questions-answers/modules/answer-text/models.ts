import { IsOptional, IsString, ValidateNested } from "class-validator";
import { AnswerID } from "#/answers/models";
import { TextAnswerVO } from "#/answers/text-answer/models";
import { QuestionID, QuestionVO } from "#/questions/models";

export class QuestionTextAnswerVO {
  @IsString()
  questionId: QuestionID;

  @IsOptional()
  @ValidateNested()
  question?: QuestionVO;

  @IsString()
  answerId: AnswerID;

  @IsOptional()
  @ValidateNested()
  answer?: TextAnswerVO;
};

export class QuestionTextAnswerEntity extends QuestionTextAnswerVO {
  @IsString()
  id: string;
};
