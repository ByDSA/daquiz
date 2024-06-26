import { model, Types } from "mongoose";
import { HistoryEntryEntity as Entity } from "../../../../domain";
import { Doc, SchemaDoc } from "./schema";

export const docToEntity = (doc: Doc): Entity => {
  return {
    id: doc._id.toString(),
    date: doc.date,
    questionAnswerId: doc.questionAnswerId.toString(),
    enteredAnswer: {
      answer: doc.enteredAnswer.answer,
      answerType: doc.enteredAnswer.answerType,
    },
    checkResult: doc.checkResult,
  };
};

export const modelName = "HistoryEntry";

const QuestionModel = model(modelName, SchemaDoc);

export const entityToDoc = (entity: Entity): Doc => {
  return new QuestionModel( {
    _id: new Types.ObjectId(entity.id),
    date: entity.date,
    questionAnswerId: new Types.ObjectId(entity.questionAnswerId),
    enteredAnswer: entity.enteredAnswer,
  } );
};
