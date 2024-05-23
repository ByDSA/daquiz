import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { QuestionEntity } from "./models";

@Schema( {
  collection: "questions",
} )
export class Question {
  @Prop( {
    type: String,
    required: false,
  } )
  text?: string;
}

export type QuestionDocument = HydratedDocument<Question>;

export const QuestionSchema = SchemaFactory.createForClass(Question);

export const QuestionModel = model("Question", QuestionSchema);

export const documentToEntity = (doc: QuestionDocument): QuestionEntity => {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: doc._id.toString(),
    text: doc.text,
  };
};

export const entityToDocument = (entity: QuestionEntity): QuestionDocument => {
  return new QuestionModel( {
    _id: new Types.ObjectId(entity.id),
    text: entity.text,
  } );
};
