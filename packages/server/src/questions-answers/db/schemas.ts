import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types, model } from "mongoose";
import { QuestionAnswerEntity } from "../models";
import { documentToEntity as answerDocumentToEntity, entityToDocument as answerEntityToDocument } from "#/answers/db";
import { AnswerType } from "#/answers/models";
import { QuestionDocument, QuestionSchema, documentToEntity as questionDocumentToEntity, entityToDocument as questionEntityToDocument } from "#/questions/db";
import { QuestionEntity } from "#/questions/models";
import { neverCase } from "#/utils/typescript";

enum QuestionAnswerPopulate {
  QUESTION_PUBLIC_KEY = "question",
  QUESTION_VIRTUAL_KEY = "fullQuestion",
  ANSWER_PUBLIC_KEY = "answer",
  TEXT_ANSWER_VIRTUAL_KEY = "text-answer",
};

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
    type: QuestionSchema,
    required: false,
  } )
  [QuestionAnswerPopulate.QUESTION_PUBLIC_KEY]: QuestionDocument;

  @Prop( {
    type: Object,
    required: false,
  } )
  [QuestionAnswerPopulate.ANSWER_PUBLIC_KEY]: Document;
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

  if (doc[QuestionAnswerPopulate.QUESTION_PUBLIC_KEY]) {
    entity.question = questionDocumentToEntity(
  doc[QuestionAnswerPopulate.QUESTION_PUBLIC_KEY] as any,
    );
  }

  if (doc[QuestionAnswerPopulate.ANSWER_PUBLIC_KEY]) {
    entity.answer = answerDocumentToEntity(
      doc[QuestionAnswerPopulate.ANSWER_PUBLIC_KEY],
      doc.answerType,
    );
  }

  return entity;
};

export const questionAnswerEntityToDocument = (
  entity: QuestionAnswerEntity,
): QuestionAnswerDocument => {
  const doc: QuestionAnswerDocument = new QuestionAnswerModel( {
    _id: new Types.ObjectId(entity.id),
    questionId: new Types.ObjectId(entity.questionId),
    answerType: entity.answerType,
    answerId: new Types.ObjectId(entity.answerId),
  } );

  if (entity.question) {
    const questionEntity: QuestionEntity = {
      id: entity.questionId,
      ...entity.question,
    };

    doc[QuestionAnswerPopulate.QUESTION_PUBLIC_KEY] = questionEntityToDocument(questionEntity);
  }

  if (entity.answer) {
    const answerEntity: unknown = {
      id: entity.answerId,
      ...entity.answer,
    };

    doc[QuestionAnswerPopulate.ANSWER_PUBLIC_KEY] = answerEntityToDocument(
      answerEntity,
      entity.answerType,
    );
  }

  return doc;
};

export function populateQuestion(question: Document): Promise<any> {
  return question.populate(QuestionAnswerPopulate.QUESTION_PUBLIC_KEY);
}

QuestionAnswerSchema.virtual(QuestionAnswerPopulate.QUESTION_VIRTUAL_KEY, {
  ref: "Question",
  localField: "questionId",
  foreignField: "_id",
  justOne: true,
} );

QuestionAnswerSchema.virtual(QuestionAnswerPopulate.TEXT_ANSWER_VIRTUAL_KEY, {
  ref: "TextAnswer",
  localField: "answerId",
  foreignField: "_id",
  justOne: true,
} );

// eslint-disable-next-line require-await
export async function populateAnswer(answer: Document, answerType: AnswerType): Promise<unknown> {
  switch (answerType) {
    case AnswerType.TEXT:
    {
      return answer.populate(QuestionAnswerPopulate.TEXT_ANSWER_VIRTUAL_KEY).then(() => {
        answer[
          QuestionAnswerPopulate.ANSWER_PUBLIC_KEY
        ] = answer[QuestionAnswerPopulate.TEXT_ANSWER_VIRTUAL_KEY];
        delete answer[QuestionAnswerPopulate.TEXT_ANSWER_VIRTUAL_KEY];
      } );
    }
    default:
      neverCase(answerType);
  }
}

QuestionAnswerSchema.set("toObject", {
  virtuals: true,
} );
QuestionAnswerSchema.set("toJSON", {
  virtuals: true,
} );
