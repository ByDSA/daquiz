import { IsArray, IsObject, IsString } from "class-validator";
import { QuestionAnswerID } from "../questions-answers/QuestionAnswer";
import { QuestionEntity } from "../questions/Question";
import { QuizEntity, QuizID } from "./Quiz";
import { RemoveManyDto, ResultManyDto, ResultOneDto } from "#/utils/dtos";

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

class QuestionAnswerPicked {
  @IsString()
  id!: QuestionAnswerID;

  @IsObject()
  question!: QuestionEntity;
}
class ResultQuizPickQuestionsAnswers {
  @IsArray()
  pickedQuestions!: QuestionAnswerPicked[];
}
export class ResultQuizPickQuestionsAnswersDto
  extends ResultOneDto<ResultQuizPickQuestionsAnswers> { }

export class RemoveManyQuestionsAnswersDto extends RemoveManyDto<QuestionAnswerID> { }
