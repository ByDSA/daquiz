import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { AnswerType } from "#/answers/domain";

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
