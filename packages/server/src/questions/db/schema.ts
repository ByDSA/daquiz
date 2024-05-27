import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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
