export {
  Quiz,
  QuizDocument,
  QuizSchema,
  docToEntity as quizDocumentToEntity,
} from "./Quiz";

export {
  QuestionAnswerInQuizDocument,
  QuestionAnswerInQuizSchema,
  docToEntity as questionAnswerInQuizDocumentToEntity, entityToDoc as questionAnswerInQuizEntityToDocument,
} from "./QuestionAnswerInQuiz";
