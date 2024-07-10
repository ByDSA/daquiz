import { IsString } from "class-validator";
import { Part, PartType } from "./Part.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export class TextPart extends Part {
  @IsSpecificString(PartType.Text)
  type!: PartType.Text;

  @IsString()
  text!: string;
}
