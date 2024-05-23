import { IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { UnknownAnswerVO } from "#/answers/models/unknown";

export class QuestionAnswerCheckingDto {
  @ValidateNested()
  answer: UnknownAnswerVO;

  @IsOptional()
  @IsBoolean()
  askForCorrectAnswer?: boolean;
};
