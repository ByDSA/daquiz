import { AnswerType } from "#shared/models/answers/Answer";
import { TextAnswerEntity } from "#shared/models/answers/text-answers/TextAnswer";
import { neverCase } from "#shared/utils/typescript";
import { TextAnswerDocument, textAnswerDocumentToEntity, entityToDocument as textAnswerEntityToDocument } from "./text-answer/db";

export const documentToEntity = (doc: unknown, type: AnswerType) => {
  switch (type) {
    case AnswerType.TEXT:
      return textAnswerDocumentToEntity(doc as TextAnswerDocument);
    default:
      return neverCase(type);
  }
};

export const entityToDocument = (entity: unknown, type: AnswerType) => {
  switch (type) {
    case AnswerType.TEXT:
      return textAnswerEntityToDocument(entity as TextAnswerEntity);
    default:
      return neverCase(type);
  }
};
