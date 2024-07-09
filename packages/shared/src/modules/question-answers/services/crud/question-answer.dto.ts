import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { QuestionAnswerEntity } from "../../models/QuestionAnswer.model";
import { IsAnswer } from "#/modules/answers/models/IsAnswer";
import { AnswerVO } from "#modules/answers/models";
import { QuestionVO } from "#modules/questions/models";
import { ResultManyDto, ResultOneDto } from "#utils/dtos";

export class CreateQuestionAnswerDto {
  @IsObject()
  @Type(() => QuestionVO)
  @ValidateNested()
  question!: QuestionVO;

  @IsAnswer()
  answer!: AnswerVO;
};

export class ResultOneQuestionAnswerDto extends ResultOneDto<QuestionAnswerEntity> { };

export class ResultManyQuestionAnswerDto extends ResultManyDto<QuestionAnswerEntity> { };
