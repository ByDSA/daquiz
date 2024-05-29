import { AnswerType } from "#shared/models/answers/Answer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class EnteredAnswer {
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

export type EnteredAnswerDoc = HydratedDocument<EnteredAnswer>;

export const EnteredAnswerSchemaDoc = SchemaFactory.createForClass(EnteredAnswer);
