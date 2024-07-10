export {
  DBModule as QuizRelationalDBModule,
} from "./module";

export {
  Quiz,
  Doc as QuizDocument,
  SchemaOdm as QuizSchema,
  docToEntity as quizDocToEntity,
} from "./schemas";

export {
  Repo as QuizRelationalRepo,
  RepoFindOptions as QuizRelationalRepoFindOptions,
} from "./repository.port";
