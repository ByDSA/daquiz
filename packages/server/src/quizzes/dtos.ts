import { IsString } from "class-validator";
import { QuizEntity, QuizID } from "./models";
import { QuestionAnswerID } from "#/questions-answers/models";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

export class CreateQuizDto {
  @IsString()
  name: QuizID;
};

export class AddQuestionsAnswersDto {
  @IsString( {
    each: true,
  } )
  questionsAnswersIds: QuestionAnswerID[];
}

export class ResultOneTextAnswerDto extends ResultOneDto<QuizEntity> { };

export class ResultManyTextAnswerDto extends ResultManyDto<QuizEntity> { };
