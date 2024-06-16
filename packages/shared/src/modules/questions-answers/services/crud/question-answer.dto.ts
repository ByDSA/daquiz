import { IsString } from "class-validator";
import { QuestionAnswerEntity, QuestionAnswerVO } from "../../models/QuestionAnswer.model";
import { ResultManyDto, ResultOneDto } from "#utils/dtos";

export class CreateQuestionAnswerDto {
  @IsString()
  questionId!: QuestionAnswerVO["questionId"];

  @IsString()
  answerType!: QuestionAnswerVO["answerType"];

  @IsString()
  answerId!: QuestionAnswerVO["answerId"];
};

export class ResultOneQuestionDto extends ResultOneDto<QuestionAnswerEntity> { };

export class ResultManyQuestionDto extends ResultManyDto<QuestionAnswerEntity> { };
