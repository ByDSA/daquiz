/* eslint-disable no-underscore-dangle */
import { QuestionEntity } from "#shared/models/questions/Question";
import { model, Types } from "mongoose";
import { QuestionDocument, QuestionSchema } from "./schema";

export const documentToEntity = (doc: QuestionDocument): QuestionEntity => {
  return {
    id: doc._id.toString(),
    text: doc.text,
  };
};

export const partialDocumentToPartialEntity = (
  doc: Partial<QuestionDocument>,
): Partial<QuestionEntity> => {
  const partial: Partial<QuestionEntity> = {};

  if (doc._id)
    partial.id = doc._id.toString();

  if (doc.text)
    partial.text = doc.text;

  return partial;
};

export const modelName = "Question";

const QuestionModel = model(modelName, QuestionSchema);

export const entityToDocument = (entity: QuestionEntity): QuestionDocument => {
  return new QuestionModel( {
    _id: new Types.ObjectId(entity.id),
    text: entity.text,
  } );
};
