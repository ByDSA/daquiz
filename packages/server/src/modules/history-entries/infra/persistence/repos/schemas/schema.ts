import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { EnteredAnswerClass } from "./EnteredAnswer.schema";

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
export class HistoryEntry {
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
    type: EnteredAnswerClass,
    required: true,
  } )
  enteredAnswer: EnteredAnswerClass;

  @Prop( {
    type: Object,
    required: true,
  } )
  checkResult: AnswerCheckResult;
}

export type Doc = HydratedDocument<HistoryEntry>;

export const SchemaDoc = SchemaFactory.createForClass(HistoryEntry);

export {
  HistoryEntry as SchemaClass,
};
