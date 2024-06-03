export {
  QuizCache,
  Doc as QuizCacheDocument,
  docToEntity as quizCacheDocToEntity,
} from "./QuizCache";

export {
  QuestionAnswerCache,
  QuestionAnswerCacheDocument,
  questionAnswerCacheDocToEntity,
  questionAnswerCacheEntityToDocument,
} from "./QuestionAnswerCache";

export {
  DBModule as QuizzesCacheDBModule,
} from "./module";
