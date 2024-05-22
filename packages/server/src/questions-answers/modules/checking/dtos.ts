import { IsBoolean, IsObject, IsOptional } from "class-validator";
import { UnknownAnswerVO } from "#/answers/models/unknown";

export class QuestionAnswerCheckingDto {
  @IsObject()
    answer: UnknownAnswerVO;

    @IsBoolean()
    @IsOptional()
      askForCorrectAnswer?: boolean;
};
