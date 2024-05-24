import { IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { UnknownAnswerVO } from "src/models/answers/unknown-answers/UnknownAnswer";

export class QuestionAnswerCheckingDto {
  @ValidateNested()
  answer!: UnknownAnswerVO;

  @IsOptional()
  @IsBoolean()
  askForCorrectAnswer?: boolean;
};
