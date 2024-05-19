import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { TextQuestionEntity } from "./models";

@Schema( {
  collection: "text-questions",
} )
export class TextQuestion {
  @Prop( {
    type: String,
    required: true,
  } )
    text: string;
}

export type TextQuestionDocument = HydratedDocument<TextQuestion>;

export const TextQuestionSchema = SchemaFactory.createForClass(TextQuestion);

export const documentToEntity = (doc: TextQuestionDocument): TextQuestionEntity => {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: doc._id.toString(),
    text: doc.text,
  };
};
