import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { TextAnswerEntity } from "./models";

@Schema( {
  collection: "text-answers",
} )
export class TextAnswer {
  @Prop( {
    type: String,
    required: true,
  } )
  text: string;
}

export type TextAnswerDocument = HydratedDocument<TextAnswer>;

export const TextAnswerSchema = SchemaFactory.createForClass(TextAnswer);

export const TextAnswerModel = model(TextAnswer.name, TextAnswerSchema);

export const textAnswerDocumentToEntity = (doc: TextAnswerDocument): TextAnswerEntity => {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: doc._id.toString(),
    text: doc.text,
  };
};

export const entityToDocument = (entity: TextAnswerEntity): TextAnswerDocument => {
  return new TextAnswerModel( {
    _id: new Types.ObjectId(entity.id),
    text: entity.text,
  } );
};
