import { ArrayMinSize } from "class-validator";
import { AudioPart } from "../AudioPart.model";
import { ImagePart } from "../ImagePart.model";
import { Part, PartType } from "../Part.model";
import { TextPart } from "../TextPart.model";
import { VideoPart } from "../VideoPart.model";
import { IsArrayPartContent } from "./IsArrayContent";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export type ArrayItem = AudioPart | ImagePart | TextPart | VideoPart;

export class ArrayPart extends Part {
  @IsSpecificString(PartType.Array)
  type!: PartType.Array;

  @ArrayMinSize(1)
  @IsArrayPartContent()
  content!: ArrayItem[];
}
