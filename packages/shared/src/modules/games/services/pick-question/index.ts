import { IsArray, IsObject, IsString } from "class-validator";
import { QuestionAnswerID } from "#modules/question-answers/models";
import { QuestionVO } from "#modules/questions/models";
import { ResultOneDto } from "#utils/dtos";

class QuestionAnswerPicked {
  @IsString()
  id!: QuestionAnswerID;

  @IsObject()
  question!: QuestionVO;
}
class ResultQuizPickQuestionsAnswers {
  @IsArray()
  pickedQuestions!: QuestionAnswerPicked[];
}
export class ResultQuizPickQuestionsAnswersDto
  extends ResultOneDto<ResultQuizPickQuestionsAnswers> { }
