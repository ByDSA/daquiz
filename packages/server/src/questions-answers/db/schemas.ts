import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { QuestionAnswerEntity } from "../models";
import { QuestionType } from "#/questions/models";
import { AnswerType } from "#/answers/models";

@Schema( {
  collection: "questions-answers",
} )
export class QuestionAnswer {
  @Prop( {
    type: String,
    enum: QuestionType,
    required: true,
  } )
    questionType: QuestionType;

  @Prop( {
    type: Types.ObjectId,
    required: true,
  } )
    questionId: ObjectId;

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
    answerId: ObjectId;
}

export type QuestionAnswerDocument = HydratedDocument<QuestionAnswer>;

export const QuestionAnswerSchema = SchemaFactory.createForClass(QuestionAnswer);

export const documentToEntity = (doc: QuestionAnswerDocument): QuestionAnswerEntity => {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: doc._id.toString(),
    questionType: doc.questionType,
    questionId: doc.questionId.toString(),
    answerType: doc.answerType,
    answerId: doc.answerId.toString(),
  };
};
