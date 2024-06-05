export {
  DBModule as QuizzesDBModule,
} from "./module";

export {
  Quiz,
  Doc as QuizDocument,
  SchemaOdm as QuizSchema,
  docToEntity as quizDocToEntity,
  updateQueryToUpdateEntity as quizUpdateQueryToUpdateEntity,
} from "./Quiz";
