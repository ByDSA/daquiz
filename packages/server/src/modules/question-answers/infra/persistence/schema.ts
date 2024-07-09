import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { AnswerType } from "#modules/answers/domain";

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
}

export type QuestionAnswerDocument = HydratedDocument<QuestionAnswer>;

export const QuestionAnswerSchema = SchemaFactory.createForClass(QuestionAnswer);

export const QuestionAnswerModel = model(QuestionAnswer.name, QuestionAnswerSchema);
