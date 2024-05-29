import { QuestionAnswerEntity } from "#shared/models/questions-answers/QuestionAnswer";
import { Types } from "mongoose";
import { QuestionAnswer, QuestionAnswerDocument, QuestionAnswerModel } from "./schemas";

export const docToEntity = (
  doc: QuestionAnswerDocument,
): QuestionAnswerEntity => {
  const entity: QuestionAnswerEntity = {
    // eslint-disable-next-line no-underscore-dangle
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
