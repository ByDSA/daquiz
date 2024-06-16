import { IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { UnknownAnswerVO } from "#modules/answers/models";

export class QuestionAnswerCheckingDto {
  @ValidateNested()
  answer!: UnknownAnswerVO;

  @IsOptional()
  @IsBoolean()
  askForCorrectAnswer?: boolean;
};
