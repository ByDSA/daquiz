import { IsBoolean, IsOptional } from "class-validator";
import { AnswerVO } from "#modules/answers/models";
import { IsAnswer } from "#modules/answers/models/IsAnswer";

export class QuestionAnswerCheckingDto {
  @IsAnswer()
  answer!: AnswerVO;

  @IsOptional()
  @IsBoolean()
  askForCorrectAnswer?: boolean;
};
