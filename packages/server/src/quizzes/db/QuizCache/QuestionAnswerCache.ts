import { AnswerType } from "#shared/models/answers/Answer";
import { TextAnswerEntity } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionAnswerInQuizEntity } from "#shared/models/quizzes/QuestionAnswerInQuiz";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { QuestionDocument, QuestionSchema, questionDocumentToEntity, questionEntityToDocument } from "#/questions/db";
import { TextAnswerDocument, textAnswerDocumentToEntity, textAnswerEntityToDocument } from "#/answers/text-answer/db";

@Schema()
export class QuestionAnswerCache {
  @Prop( {
    type: QuestionSchema,
    required: true,
  } )
  question: QuestionDocument;

  @Prop( {
    type: String,
    enum: AnswerType,
    required: true,
  } )
  answerType: AnswerType;

  @Prop( {
    type: Object,
    required: true,
  } )
  answer: object;
}

type Doc = HydratedDocument<QuestionAnswerCache>;

const SchemaOdm = SchemaFactory.createForClass(QuestionAnswerCache);
const Model = model(
  QuestionAnswerCache.name,
  SchemaOdm,
);
const docToEntity = (
  doc: Doc,
): QuestionAnswerInQuizEntity => {
  const entity: QuestionAnswerInQuizEntity = {
    id: doc._id.toString(),
    answerType: doc.answerType,
    questionId: doc.question._id.toString(),
    question: questionDocumentToEntity(doc.question),
    answerId: (doc.answer as any)._id.toString(),
    answer: textAnswerDocumentToEntity(doc.answer as TextAnswerDocument),
  };

  return entity;
};
const entityToDoc = (
  entity: QuestionAnswerInQuizEntity,
): Doc => {
  const questionEntity = {
    id: entity.questionId,
    ...entity.question,
  };
  const answerEntity: TextAnswerEntity = {
    id: entity.answerId,
    ...entity.answer,
  };
  const docObj: QuestionAnswerCache & {_id: Types.ObjectId} = {
    _id: new Types.ObjectId(entity.id),
    answerType: entity.answerType,
    question: questionEntityToDocument(questionEntity),
    answer: textAnswerEntityToDocument(answerEntity),
  };
  const doc: Doc = new Model(docObj);

  return doc;
};

export {
  Doc as QuestionAnswerCacheDocument,
  SchemaOdm as QuestionAnswerCacheSchema,
  docToEntity as questionAnswerCacheDocToEntity,
  entityToDoc as questionAnswerCacheEntityToDocument,
};
