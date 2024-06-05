import { neverCase } from "#shared/utils/typescript";
import { AnswerType } from "./domain";
import { TextAnswerDocument, textAnswerDocumentToEntity, textAnswerEntityToDocument } from "./text-answer/db";
import { TextAnswerEntity } from "./text-answer/domain";

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
