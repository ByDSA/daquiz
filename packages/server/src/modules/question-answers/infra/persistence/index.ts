export {
  QuestionAnswer,
  QuestionAnswerDocument,
  QuestionAnswerModel,
  QuestionAnswerSchema,
} from "./schema";

export {
  docToEntity as questionAnswerDocumentToEntity,
} from "./adapters";

export {
  DBModule as QuestionAnswerDBModule,
} from "./module";

export {
  Repo as QuestionAnswerRepo,
} from "./repository.port";
