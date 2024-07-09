import { neverCase } from "#shared/utils/typescript";
import { AnswerType } from "./domain";
import { TextAnswerEntity } from "./submodules/text-answer/domain";
import { TextAnswerDocument, textAnswerDocToEntity as textAnswerDocToVO, textAnswerEntityToDoc } from "./submodules/text-answer/infra/persistence";

export const docToVO = (doc: unknown, type: AnswerType) => {
  switch (type) {
    case AnswerType.Text:
      return textAnswerDocToVO(doc as TextAnswerDocument);
    case AnswerType.Set:
      throw new Error("Not implemented");
    default:
      return neverCase(type);
  }
};

export const entityToDocument = (entity: unknown, type: AnswerType) => {
  switch (type) {
    case AnswerType.Text:
      return textAnswerEntityToDoc(entity as TextAnswerEntity);
    case AnswerType.Set:
      throw new Error("Not implemented");
    default:
      return neverCase(type);
  }
};
