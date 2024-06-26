import { QuizID, ResultQuizPickQuestionsAnswersDto } from "../domain/models";

export interface QuestionAnswerPickerService {
  pickOneQuestionAnswer(quizId: QuizID): Promise<ResultQuizPickQuestionsAnswersDto>;
}

export const QuestionAnswerPickerService = Symbol("QuestionAnswerPickerService");
