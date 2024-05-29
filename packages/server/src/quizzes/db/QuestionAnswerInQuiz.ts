import { AnswerType } from "#shared/models/answers/Answer";
import { TextAnswerEntity } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionAnswerInQuizEntity } from "#shared/models/quizzes/QuestionAnswerInQuiz";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { QuestionDocument, QuestionSchema, questionDocumentToEntity, questionEntityToDocument } from "#/questions/db";
import { TextAnswerDocument, textAnswerDocumentToEntity, textAnswerEntityToDocument } from "#/answers/text-answer/db";

@Schema()
export class QuestionAnswerInQuiz {
  @Prop( {
    type: QuestionSchema,
    required: false,
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

export type QuestionAnswerInQuizDocument = HydratedDocument<QuestionAnswerInQuiz>;

export const QuestionAnswerInQuizSchema = SchemaFactory.createForClass(QuestionAnswerInQuiz);

export const QuestionAnswerInQuizModel = model(QuestionAnswerInQuiz.name, QuestionAnswerInQuizSchema);

export const docToEntity = (
  doc: QuestionAnswerInQuizDocument,
): QuestionAnswerInQuizEntity => {
  const entity: QuestionAnswerInQuizEntity = {
    // eslint-disable-next-line no-underscore-dangle
    id: doc._id.toString(),
    answerType: doc.answerType,
    questionId: doc.question._id.toString(),
    question: questionDocumentToEntity(doc.question),
    answerId: (doc.answer as any)._id.toString(),
    answer: textAnswerDocumentToEntity(doc.answer as TextAnswerDocument),
  };

  return entity;
};

export const entityToDoc = (
  entity: QuestionAnswerInQuizEntity,
): QuestionAnswerInQuizDocument => {
  const questionEntity = {
    id: entity.questionId,
    ...entity.question,
  };
  const answerEntity: TextAnswerEntity = {
    id: entity.answerId,
    ...entity.answer,
  };
  const docObj: QuestionAnswerInQuiz & {_id: Types.ObjectId} = {
    _id: new Types.ObjectId(entity.id),
    answerType: entity.answerType,
    question: questionEntityToDocument(questionEntity),
    answer: textAnswerEntityToDocument(answerEntity),
  };
  const doc: QuestionAnswerInQuizDocument = new QuestionAnswerInQuizModel(docObj);

  return doc;
};
