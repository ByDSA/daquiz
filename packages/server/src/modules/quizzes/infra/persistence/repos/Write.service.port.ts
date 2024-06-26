import { AddQuestionsAnswersDto, CreateQuizDto, QuizEntity, QuizID } from "../../../domain/models";
import { CreateOneAndGetService } from "#/utils/services/crud";
import { QuestionAnswerID } from "#modules/questions-answers/domain";

export interface WriteService extends
CreateOneAndGetService<CreateQuizDto, QuizEntity> {
  addManyQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<void>;
  removeOneQuestionAnswer(id: QuizID, questionAnswerId: QuestionAnswerID): Promise<void>;
  removeManyQuestionsAnswers(id: QuizID, questionAnswerIds: QuestionAnswerID[]): Promise<void>;
}
