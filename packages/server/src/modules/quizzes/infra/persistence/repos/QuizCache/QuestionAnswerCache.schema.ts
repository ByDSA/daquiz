import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { QuestionAnswerInQuizEntity } from "../../../../domain";
import { TextAnswerEntity } from "#/modules/answers/submodules/text-answer/domain";
import { TextAnswerDocument, textAnswerDocToEntity, textAnswerEntityToDoc } from "#/modules/answers/submodules/text-answer/infra/persistence";
import { AnswerType } from "#modules/answers/domain";
import { QuestionDocument, QuestionSchema, questionDocumentToEntity, questionEntityToDocument } from "#modules/questions/infra/persistence/repos/schemas";

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
    answer: textAnswerDocToEntity(doc.answer as TextAnswerDocument),
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
    answer: textAnswerEntityToDoc(answerEntity),
  };
  const doc: Doc = new Model(docObj);

  return doc;
};

export {
  Doc as QuestionAnswerCacheDocument,
  SchemaOdm as QuestionAnswerCacheSchema,
  docToEntity as questionAnswerCacheDocToEntity,
  entityToDoc as questionAnswerCacheEntityToDoc,
};
