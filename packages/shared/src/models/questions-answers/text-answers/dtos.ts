import { IsString } from "class-validator";
import { QuestionTextAnswerEntity } from "./QuestionTextAnswer";
import { ResultOneDto } from "#/utils/dtos";

export class CreateQuestionTextAnswerDto {
  @IsString()
  question!: string;

  @IsString()
  answer!: string;
};

export class ResultOneQuestionTextAnswerDto extends ResultOneDto<QuestionTextAnswerEntity> {};
