import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema( {
  collection: "text-answers",
} )
export class TextAnswer {
  @Prop( {
    type: String,
    required: true,
  } )
  text: string;
}

type DocumentOdm = HydratedDocument<TextAnswer>;

const SchemaOdm = SchemaFactory.createForClass(TextAnswer);

export {
  DocumentOdm, TextAnswer as SchemaClass, SchemaOdm,
};
