import { IsOptional, IsString, ValidateNested } from "class-validator";
import { AnswerID } from "src/models/answers/Answer";
import { TextAnswerVO } from "src/models/answers/text-answers/TextAnswer";
import { QuestionID, QuestionVO } from "src/models/questions/Question";

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
