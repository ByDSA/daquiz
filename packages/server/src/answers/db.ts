import { AnswerType } from "./models";
import { TextAnswerDocument, textAnswerDocumentToEntity, entityToDocument as textAnswerEntityToDocument } from "./text-answer/db";
import { TextAnswerEntity } from "./text-answer/models";
import { neverCase } from "#/utils/typescript";

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
