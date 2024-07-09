import { Type } from "class-transformer";
import { IsDate, IsObject, IsString } from "class-validator";
import { EnteredAnswer } from "./EnteredAnswer.model";
import { AnswerCheckResult } from "#modules/question-answers/services/checking";
import { QuestionAnswerID } from "#modules/question-answers/models";

export class HistoryEntryVO {
  @IsDate()
  date!: Date;

  @IsString()
  questionAnswerId!: QuestionAnswerID;

  @IsObject()
  @Type(() => EnteredAnswer)
  enteredAnswer!: EnteredAnswer;

  @IsObject()
  @Type(() => AnswerCheckResult)
  checkResult!: AnswerCheckResult;
};

export type HistoryEntryID = string;

export class HistoryEntryEntity extends HistoryEntryVO {
  @IsString()
  id!: HistoryEntryID;
};
