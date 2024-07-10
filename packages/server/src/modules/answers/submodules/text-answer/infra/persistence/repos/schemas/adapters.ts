import { model } from "mongoose";
import { AnswerType, TextAnswerEntity, TextAnswerVO as VO } from "../../../../domain";
import { DocumentOdm, SchemaOdm } from "./schema";

export const docToVO = (doc: DocumentOdm): VO => {
  return {
    text: doc.text,
    type: AnswerType.Text,
  };
};

/**
 * @deprecated
 */
// eslint-disable-next-line require-await
export const docToEntity = async (doc: DocumentOdm): Promise<TextAnswerEntity> => {
  const id = ""; // TODO: usar la de QuestionAnswerEntity

  return {
    id,
    ...docToVO(doc),
  };
};

export const modelName = "TextAnswer";

export const ModelOdm = model(modelName, SchemaOdm);

export const voToDoc = (vo: VO): DocumentOdm => {
  return new ModelOdm( {
    text: vo.text,
  } );
};

export const partialDocToPartialVO = (
  doc: Partial<DocumentOdm>,
): Partial<VO> => {
  const partial: Partial<VO> = {};

  if (doc.text)
    partial.text = doc.text;

  return partial;
};
