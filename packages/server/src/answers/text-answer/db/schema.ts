import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema( {
  collection: "text-answers",
} )
export class SchemaOdmClass {
  @Prop( {
    type: String,
    required: true,
  } )
  text: string;
}

export type DocumentOdm = HydratedDocument<SchemaOdmClass>;

export const SchemaOdm = SchemaFactory.createForClass(SchemaOdmClass);
