export {
  SchemaOdmClass as TextAnswer,
  DocumentOdm as TextAnswerDocument,
  SchemaOdm as TextAnswerSchema,
} from "./schema";

export {
  docToEntity as textAnswerDocumentToEntity,
  entityToDoc as textAnswerEntityToDocument,
} from "./adapters";

export {
  Service as TextAnswerDBService,
} from "./service";

export {
  Module as TextAnswersDBModule,
} from "./module";
