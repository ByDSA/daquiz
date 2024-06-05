import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { AddQuestionsAnswersDto, CreateQuizDto, QuizEntity, QuizID } from "../../models";
import { CreateOneAndGetService } from "#/utils/services/crud";

export interface WriteServicePort extends
CreateOneAndGetService<CreateQuizDto, QuizEntity> {
  addManyQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<void>;
  removeOneQuestionAnswer(id: QuizID, questionAnswerId: QuestionAnswerID): Promise<void>;
  removeManyQuestionsAnswers(id: QuizID, questionAnswerIds: QuestionAnswerID[]): Promise<void>;
}
