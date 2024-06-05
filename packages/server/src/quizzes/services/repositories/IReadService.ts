import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { ResultQuizPickQuestionsAnswersDto } from "#shared/models/quizzes/dtos";
import { FindAllService, FindOneService } from "#/utils/services/crud";

export interface IReadService extends
FindOneService<QuizEntity>,
FindAllService<QuizEntity> {
  pickQuestionsAnswers(id: QuizID): Promise<ResultQuizPickQuestionsAnswersDto>;
}
