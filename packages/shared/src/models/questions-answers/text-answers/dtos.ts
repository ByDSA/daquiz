import { IsObject } from "class-validator";
import { QuestionTextAnswerEntity } from "./QuestionTextAnswer";
import { CreateTextAnswerDto } from "#/models/answers/text-answers/dtos";
import { CreateOneQuestionDto } from "#/models/questions/dtos";
import { ResultOneDto } from "#/utils/dtos";

export class CreateQuestionTextAnswerDto {
  @IsObject()
  question!: CreateOneQuestionDto;

  @IsObject()
  answer!: CreateTextAnswerDto;
};

export class ResultOneQuestionTextAnswerDto extends ResultOneDto<QuestionTextAnswerEntity> {};
