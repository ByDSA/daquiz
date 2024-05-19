import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { QuestionDocument, QuestionSchema } from "./question.schema";

@Schema()
export class CompoundQuestion {
  @Prop( {
    type: [QuestionSchema],
    required: true,
  } )
    questions: QuestionDocument[];
}

export type CompoundQuestionDocument = HydratedDocument<CompoundQuestion>;

export const CompoundQuestionSchema = SchemaFactory.createForClass(CompoundQuestion);
