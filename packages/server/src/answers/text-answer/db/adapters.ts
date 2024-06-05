import { Types, model } from "mongoose";
import { TextAnswerEntity as Entity } from "../domain";
import { DocumentOdm, SchemaOdm } from "./schema";

export const docToEntity = (doc: DocumentOdm): Entity => {
  return {

    id: doc._id.toString(),
    text: doc.text,
  };
};

export const modelName = "TextAnswer";

export const ModelOdm = model(modelName, SchemaOdm);

export const entityToDoc = (entity: Entity): DocumentOdm => {
  return new ModelOdm( {
    _id: new Types.ObjectId(entity.id),
    text: entity.text,
  } );
};

export const partialDocumentToPartialEntity = (
  doc: Partial<DocumentOdm>,
): Partial<Entity> => {
  const partial: Partial<Entity> = {};

  if (doc._id)
    partial.id = doc._id.toString();

  if (doc.text)
    partial.text = doc.text;

  return partial;
};
