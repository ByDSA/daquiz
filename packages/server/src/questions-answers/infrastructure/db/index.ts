export {
  QuestionAnswer,
  QuestionAnswerDocument,
  QuestionAnswerModel,
  QuestionAnswerSchema,
} from "./schemas";

export {
  docToEntity as questionAnswerDocumentToEntity,
  entityToDoc as questionAnswerEntityToDocument,
} from "./adapters";
