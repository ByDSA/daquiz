import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Choice, Multimedia } from "./multimedia.schema";

@Schema( {
  collection: "questions",
} )
export class Question extends Multimedia {
  @Prop( {
    type: Array<Choice>,
    required: false,
  } )
  choices?: Choice[];
}

export type QuestionDocument = HydratedDocument<Question>;

export const QuestionSchema = SchemaFactory.createForClass(Question);
