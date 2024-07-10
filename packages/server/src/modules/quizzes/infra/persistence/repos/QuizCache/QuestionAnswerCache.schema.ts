import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { TextAnswerEntity, TextAnswerVO } from "#/modules/answers/submodules/text-answer/domain";
import { TextAnswerDocument, textAnswerDocToEntity, textAnswerEntityToDoc } from "#/modules/answers/submodules/text-answer/infra/persistence";
import { QuestionAnswerEntity } from "#/modules/question-answers";
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
): QuestionAnswerEntity => {
  const entity: QuestionAnswerEntity = {
    id: doc._id.toString(),
    question: questionDocumentToEntity(doc.question),
    answer: textAnswerDocToEntity(doc.answer as TextAnswerDocument),
  };

  return entity;
};
const entityToDoc = (
  entity: QuestionAnswerEntity,
): Doc => {
  const questionEntity = {
    id: entity.id,
    ...entity.question,
  };
  const answerEntity: TextAnswerEntity = {
    id: entity.id,
    ...(entity.answer as TextAnswerVO),
  };
  const docObj: QuestionAnswerCache & {_id: Types.ObjectId} = {
    _id: new Types.ObjectId(entity.id),
    answerType: entity.answer.type,
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
