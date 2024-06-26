import { Types } from "mongoose";
import { QuestionAnswerEntity } from "../../../domain";
import { QuestionAnswer, QuestionAnswerDocument, QuestionAnswerModel } from "./schema";

export const docToEntity = (
  doc: QuestionAnswerDocument,
): QuestionAnswerEntity => {
  const entity: QuestionAnswerEntity = {
    id: doc._id.toString(),
    questionId: doc.questionId.toString(),
    answerType: doc.answerType,
    answerId: doc.answerId.toString(),
  };

  return entity;
};

export const entityToDoc = (
  entity: QuestionAnswerEntity,
): QuestionAnswerDocument => {
  const docObj: QuestionAnswer & {_id: Types.ObjectId} = {
    _id: new Types.ObjectId(entity.id),
    questionId: new Types.ObjectId(entity.questionId),
    answerType: entity.answerType,
    answerId: new Types.ObjectId(entity.answerId),
  };
  const doc: QuestionAnswerDocument = new QuestionAnswerModel(docObj);

  return doc;
};
