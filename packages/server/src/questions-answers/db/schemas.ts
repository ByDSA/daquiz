import { AnswerType } from "#shared/models/answers/Answer";
import { TextAnswerEntity } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionAnswerEntity } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity } from "#shared/models/questions/Question";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { QuestionDocument, QuestionSchema, questionDocumentToEntity, questionEntityToDocument } from "#/questions/db";
import { TextAnswerDocument, textAnswerDocumentToEntity, textAnswerEntityToDocument } from "#/answers/text-answer/db";

@Schema( {
  collection: "questions-answers",
} )
export class QuestionAnswer {
  @Prop( {
    type: Types.ObjectId,
    required: true,
  } )
  questionId: Types.ObjectId;

  @Prop( {
    type: QuestionSchema,
    required: false,
  } )
  question?: QuestionDocument;

  @Prop( {
    type: String,
    enum: AnswerType,
    required: true,
  } )
  answerType: AnswerType;

  @Prop( {
    type: Types.ObjectId,
    required: true,
  } )
  answerId: Types.ObjectId;

  @Prop( {
    type: Object,
    required: false,
  } )
  answer?: object;
}

export type QuestionAnswerDocument = HydratedDocument<QuestionAnswer>;

export const QuestionAnswerSchema = SchemaFactory.createForClass(QuestionAnswer);

export const QuestionAnswerModel = model(QuestionAnswer.name, QuestionAnswerSchema);

export const questionAnswerDocumentToEntity = (
  doc: QuestionAnswerDocument,
): QuestionAnswerEntity => {
  const entity: QuestionAnswerEntity = {
    // eslint-disable-next-line no-underscore-dangle
    id: doc._id.toString(),
    questionId: doc.questionId.toString(),
    answerType: doc.answerType,
    answerId: doc.answerId.toString(),
  };

  if (doc.question)
    entity.question = questionDocumentToEntity(doc.question);

  if (doc.answer)
    entity.answer = textAnswerDocumentToEntity(doc.answer as TextAnswerDocument);

  return entity;
};

type EntityToDocumentOptions = {
  includeRelations?: {
    question?: boolean;
    answer?: boolean;
  };
};
export const questionAnswerEntityToDocument = (
  entity: QuestionAnswerEntity,
  options?: EntityToDocumentOptions,
): QuestionAnswerDocument => {
  const docObj: QuestionAnswer & {_id: Types.ObjectId} = {
    _id: new Types.ObjectId(entity.id),
    questionId: new Types.ObjectId(entity.questionId),
    answerType: entity.answerType,
    answerId: new Types.ObjectId(entity.answerId),
  };

  if (options?.includeRelations?.question && entity.question) {
    const questionEntity: QuestionEntity = {
      id: entity.questionId,
      ...entity.question,
    };

    docObj.question = questionEntityToDocument(questionEntity);
  }

  if (options?.includeRelations?.answer && entity.answer) {
    const textAnswerEntity: TextAnswerEntity = {
      id: entity.answerId,
      ...entity.answer,
    };

    docObj.answer = textAnswerEntityToDocument(textAnswerEntity);
  }

  const doc: QuestionAnswerDocument = new QuestionAnswerModel(docObj);

  return doc;
};
