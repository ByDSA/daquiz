import { Type } from "class-transformer";
import { IsObject, IsString } from "class-validator";
import { QuestionAnswerID } from "#modules/questions-answers/models";
import { AnswerCheckResult } from "#modules/questions-answers/services/checking";

export class CreateOneHistoryEntryDto {
  @IsString()
  questionAnswerId!: QuestionAnswerID;

  @IsObject()
  enteredAnswer!: {
    answerType: string;
    answer: object;
  };

  @IsObject()
  @Type(() => AnswerCheckResult)
  checkResult!: AnswerCheckResult;
};
