import { neverCase } from "#shared/utils/typescript";
import { AnswerType } from "./domain";
import { TextAnswerEntity } from "./submodules/text-answer/domain";
import { TextAnswerDocument, textAnswerDocToEntity, textAnswerEntityToDoc } from "./submodules/text-answer/infra/persistence";

export const docToEntity = (doc: unknown, type: AnswerType) => {
  switch (type) {
    case AnswerType.TEXT:
      return textAnswerDocToEntity(doc as TextAnswerDocument);
    default:
      return neverCase(type);
  }
};

export const entityToDocument = (entity: unknown, type: AnswerType) => {
  switch (type) {
    case AnswerType.TEXT:
      return textAnswerEntityToDoc(entity as TextAnswerEntity);
    default:
      return neverCase(type);
  }
};
