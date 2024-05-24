import { IsString } from "class-validator";
import { QuestionAnswerID } from "../questions-answers/QuestionAnswer";
import { QuizEntity, QuizID } from "./Quiz";
import { ResultManyDto, ResultOneDto } from "#/utils/dtos";

export class CreateQuizDto {
  @IsString()
  name!: QuizID;
};

export class AddQuestionsAnswersDto {
  @IsString( {
    each: true,
  } )
  questionsAnswersIds!: QuestionAnswerID[];
}

export class ResultOneQuizDto extends ResultOneDto<QuizEntity> { };

export class ResultManyQuizDto extends ResultManyDto<QuizEntity> { };
