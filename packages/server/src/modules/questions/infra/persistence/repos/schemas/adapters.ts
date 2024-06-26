import { model, Types } from "mongoose";
import { QuestionEntity } from "../../../../domain";
import { multimediaDocToEntity, multimediaEntityToDoc } from "./multimedia.adapter";
import { Choice } from "./multimedia.schema";
import { QuestionDocument, QuestionSchema } from "./schema";
import { ArrayElement } from "#/utils/typescript";

type ChoiceInQuestion = ArrayElement<NonNullable<QuestionEntity["choices"]>>;

const choiceDocToEntity = (doc: Choice): ChoiceInQuestion => {
  const multimediaPart = multimediaDocToEntity(doc);
  const entity: ChoiceInQuestion = {
    ...multimediaPart,
  };

  return entity;
};

export const docToEntity = (doc: QuestionDocument): QuestionEntity => {
  const requiredPart: QuestionEntity = {
    id: doc._id.toString(),
  };
  const multimediaPart = multimediaDocToEntity(doc);
  const entity: QuestionEntity = {
    ...requiredPart,
    ...multimediaPart,
    choices: doc.choices?.map(choiceDocToEntity),
  };

  return entity;
};

export const partialDocToPartialEntity = (
  doc: Partial<QuestionDocument>,
): Partial<QuestionEntity> => {
  const partial: Partial<QuestionEntity> = {};

  if (doc._id)
    partial.id = doc._id.toString();

  if (doc.text)
    partial.text = doc.text;

  if (doc.choices)
    partial.choices = doc.choices.map(choiceDocToEntity);

  return partial;
};

export const modelName = "Question";

const QuestionModel = model(modelName, QuestionSchema);

export const entityToDocument = (entity: QuestionEntity): QuestionDocument => {
  const requiredPart = {
    _id: new Types.ObjectId(entity.id),
  };
  const optionalPart: Omit<QuestionEntity, "id"> = {};

  if (entity.choices)
    optionalPart.choices = entity.choices.map(multimediaEntityToDoc);

  const multimediaPart = multimediaEntityToDoc(entity);
  const doc = {
    ...requiredPart,
    ...optionalPart,
    ...multimediaPart,
  };

  return new QuestionModel(doc);
};
