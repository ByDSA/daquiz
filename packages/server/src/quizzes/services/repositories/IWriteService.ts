import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { AddQuestionsAnswersDto, CreateQuizDto } from "#shared/models/quizzes/dtos";
import { CreateOneAndGetService } from "#/utils/services/crud";

export interface IWriteService extends
CreateOneAndGetService<CreateQuizDto, QuizEntity> {
  addManyQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<void>;
  removeOneQuestionAnswer(id: QuizID, questionAnswerId: QuestionAnswerID): Promise<void>;
  removeManyQuestionsAnswers(id: QuizID, questionAnswerIds: QuestionAnswerID[]): Promise<void>;
}
