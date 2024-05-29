import { Type } from "class-transformer";
import { IsDate, IsEnum, IsObject, IsString } from "class-validator";
import { AnswerType } from "../answers/Answer";
import { QuestionAnswerID } from "../questions-answers/QuestionAnswer";
import { AnswerCheckResult } from "../questions-answers/checking/AnswerCheckResult";

class EnteredAnswer {
  @IsEnum(AnswerType)
  answerType!: AnswerType;

  @IsString()
  answer!: object;
}

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
