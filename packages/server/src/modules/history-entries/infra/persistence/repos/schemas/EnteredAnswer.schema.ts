import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { AnswerType } from "#modules/answers/domain";

@Schema()
export class EnteredAnswerClass {
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

export type EnteredAnswerDoc = HydratedDocument<EnteredAnswerClass>;

export const EnteredAnswerSchemaDoc = SchemaFactory.createForClass(EnteredAnswerClass);
