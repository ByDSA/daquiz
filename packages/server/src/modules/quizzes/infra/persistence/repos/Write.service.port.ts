import { AddQuestionsAnswersDto, CreateQuizDto, QuizEntity, QuizID } from "../../../domain/models";
import { QuestionAnswerID } from "#modules/question-answers/domain";
import { CreateOneAndGetService } from "#utils/services/crud";

export interface WriteService extends
CreateOneAndGetService<CreateQuizDto, QuizEntity> {
  addManyQuestionsAnswers(id: QuizID, dto: AddQuestionsAnswersDto): Promise<void>;
  removeOneQuestionAnswer(id: QuizID, questionAnswerId: QuestionAnswerID): Promise<void>;
  removeManyQuestionsAnswers(id: QuizID, questionAnswerIds: QuestionAnswerID[]): Promise<void>;
}
