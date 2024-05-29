import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { EnteredAnswer } from "./EnteredAnswer";

class AnswerCheckResult {
  @Prop( {
    type: Boolean,
    required: true,
  } )
  isCorrect: boolean;
}

@Schema( {
  collection: "history-entries",
} )
export class SchemaClass {
  @Prop( {
    type: Types.ObjectId,
    required: true,
  } )
  questionAnswerId: ObjectId;

  @Prop( {
    type: Date,
    required: true,
  } )
  date: Date;

  @Prop( {
    type: EnteredAnswer,
    required: true,
  } )
  enteredAnswer: EnteredAnswer;

  @Prop( {
    type: Object,
    required: true,
  } )
  checkResult: AnswerCheckResult;
}

export type Doc = HydratedDocument<SchemaClass>;

export const SchemaDoc = SchemaFactory.createForClass(SchemaClass);
