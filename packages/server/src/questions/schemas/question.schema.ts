import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema( {
  discriminatorKey: "kind",
  _id: false,
} )
export class Question {
  @Prop( {
    required: true,
  } )
    kind: string;
}

export type QuestionDocument = HydratedDocument<Question>;

export const QuestionSchema = SchemaFactory.createForClass(Question);
