import { QuizID, ResultQuizPickQuestionsAnswersDto } from "../../models";

export interface QuestionAnswerPickerService {
  pickOneQuestionAnswer(quizId: QuizID): Promise<ResultQuizPickQuestionsAnswersDto>;
}

export const QuestionAnswerPickerService = Symbol("QuestionAnswerPickerService");
