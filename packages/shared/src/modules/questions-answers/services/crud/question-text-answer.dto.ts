import { IsObject } from "class-validator";
import { QuestionTextAnswerEntity } from "../../models";
import { CreateTextAnswerDto } from "#modules/answers/services/text-answer/crud";
import { CreateOneQuestionDto } from "#modules/questions/services/crud";
import { ResultOneDto } from "#utils/dtos";

export class CreateQuestionTextAnswerDto {
  @IsObject()
  question!: CreateOneQuestionDto;

  @IsObject()
  answer!: CreateTextAnswerDto;
};

export class ResultOneQuestionTextAnswerDto extends ResultOneDto<QuestionTextAnswerEntity> {};
