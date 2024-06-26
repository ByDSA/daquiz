export {
  Question, QuestionDocument, QuestionSchema,
} from "./schema";

export {
  partialDocToPartialEntity as partialQuestionDocumentToPartialEntity,
  docToEntity as questionDocumentToEntity,
  entityToDocument as questionEntityToDocument,
  modelName as questionModelName,
} from "./adapters";
