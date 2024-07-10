import { MultimediaPart } from "./MultimediaPart.model";
import { PartType } from "./Part.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export class ImagePart extends MultimediaPart {
  @IsSpecificString(PartType.Image)
  type!: PartType.Image;
}
