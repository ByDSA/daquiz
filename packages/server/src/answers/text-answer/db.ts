import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
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

export const textAnswerDocumentToEntity = (doc: TextAnswerDocument): TextAnswerEntity => {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: doc._id.toString(),
    text: doc.text,
  };
};
