import { IsBoolean, IsOptional } from "class-validator";
import { IsAnswer } from "#/modules/answers/models/IsAnswer";
import { AnswerVO } from "#modules/answers/models";

export class QuestionAnswerCheckingDto {
  @IsAnswer()
  answer!: AnswerVO;

  @IsOptional()
  @IsBoolean()
  askForCorrectAnswer?: boolean;
};
