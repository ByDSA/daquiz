import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Multimedia {
  @Prop( {
    type: String,
    required: false,
  } )
  text?: string;
}

@Schema()
export class Choice extends Multimedia {
}
