import { Type } from "class-transformer";
import { IsObject, IsString } from "class-validator";
import { QuestionAnswerID } from "../questions-answers/QuestionAnswer";
import { AnswerCheckResult } from "../questions-answers/checking/AnswerCheckResult";
import { HistoryEntryEntity } from "./HistoryEntry";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

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

export class ResultOneHistoryEntryDto extends ResultOneDto<HistoryEntryEntity> { };

export class ResultManyHistoryEntryDto extends ResultManyDto<HistoryEntryEntity> { };
