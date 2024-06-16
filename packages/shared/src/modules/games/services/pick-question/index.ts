import { IsArray, IsObject, IsString } from "class-validator";
import { QuestionAnswerID } from "#modules/questions-answers/models";
import { QuestionEntity } from "#modules/questions/models";
import { ResultOneDto } from "#utils/dtos";

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
